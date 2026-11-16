import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const src = path.join("node_modules", "pdfjs-dist", "legacy", "build", "pdf.worker.min.mjs");
const destDir = path.join("public");
const dest = path.join(destDir, "pdf.worker.min.mjs");

mkdirSync(destDir, { recursive: true });
copyFileSync(src, dest);
console.log("Copied pdfjs worker to public/pdf.worker.min.mjs");
