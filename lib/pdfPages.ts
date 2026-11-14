// Render PDF pages to PNG Files entirely in the browser so deck uploads
// can send raw page images to the Go API (which stamps + stores them).

import workerUrl from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";

const MAX_PAGES = 60;
const RENDER_SCALE = 2; // ~144 dpi for A4 — matches deck slide resolution needs

export async function renderPdfPages(file: File, onProgress?: (done: number, total: number) => void): Promise<File[]> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

  const data = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data });
  const doc = await loadingTask.promise;
  const total = Math.min(doc.numPages, MAX_PAGES);
  const pages: File[] = [];

  for (let i = 1; i <= total; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: RENDER_SCALE });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas tidak didukung browser.");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: context, viewport, canvas }).promise;
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error(`Halaman ${i} gagal dirender.`);
    pages.push(new File([blob], `page-${String(i).padStart(3, "0")}.png`, { type: "image/png" }));
    onProgress?.(i, total);
  }

  await loadingTask.destroy();
  return pages;
}
