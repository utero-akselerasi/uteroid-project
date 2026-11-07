import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const runtime = "nodejs";

const s3Endpoint = process.env.S3_ENDPOINT;
const s3Client = new S3Client({
  region: process.env.S3_REGION || "us-east-1",
  ...(s3Endpoint ? { endpoint: s3Endpoint, forcePathStyle: true } : {}),
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
  },
});

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

    // Check if S3 is configured
    const accessKey = process.env.S3_ACCESS_KEY;
    const secretKey = process.env.S3_SECRET_KEY;
    const bucket = process.env.S3_BUCKET;

    if (!accessKey || !secretKey || !bucket) {
      return NextResponse.json({
        error: "S3 storage belum dikonfigurasi. Pastikan S3_ACCESS_KEY, S3_SECRET_KEY, dan S3_BUCKET diatur di environment variables.",
      }, { status: 500 });
    }

    // Generate unique filename
    const ext = file.name.split(".").pop() || (file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg");
    const sanitizedName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 50);
    const uniqueSuffix = Date.now() + "-" + Math.random().toString(36).substring(2, 9);
    const filename = `banners/${sanitizedName}-${uniqueSuffix}.${ext}`;

    // Upload to S3
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: filename,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    const publicUrl = `/portfolio-api/media/${filename}`;

    return NextResponse.json({ url: publicUrl, filename, size: file.size });
  } catch (err: any) {
    console.error("[upload-banner] Upload failed:", err);
    return NextResponse.json({ error: "Gagal mengunggah file gambar: " + (err?.message || "Unknown error") }, { status: 500 });
  }
}
