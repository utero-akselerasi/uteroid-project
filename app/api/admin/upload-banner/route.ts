import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran file melebihi 20 MB." }, { status: 413 });
    }

    const validMimes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json({ error: "Format file harus JPEG, PNG, WebP, SVG, atau GIF." }, { status: 400 });
    }

    // Check if Vercel Blob is configured
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (!blobToken) {
      return NextResponse.json({
        error: "BLOB_READ_WRITE_TOKEN belum dikonfigurasi. Hubungi administrator untuk mengatur Vercel Blob Storage.",
      }, { status: 500 });
    }

    // Upload to Vercel Blob
    const ext = file.name.split('.').pop() || (file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg");
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 50);
    const uniqueSuffix = Date.now() + "-" + Math.random().toString(36).substring(2, 9);
    const filename = `uploads/${sanitizedName}-${uniqueSuffix}.${ext}`;

    const blob = await put(filename, file, {
      access: 'public',
      token: blobToken,
    });

    return NextResponse.json({ url: blob.url, filename: blob.pathname, size: file.size });
  } catch (err: any) {
    console.error("[upload-banner] Upload failed:", err);
    return NextResponse.json({ error: "Gagal mengunggah file gambar: " + (err?.message || "Unknown error") }, { status: 500 });
  }
}
