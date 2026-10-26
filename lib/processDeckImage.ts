import sharp, { type Metadata } from "sharp";

const MAX_INPUT_BYTES = 20 * 1024 * 1024;
const MAX_INPUT_DIMENSION = 12_000;
const MAX_OUTPUT_DIMENSION = 3_840;
const WATERMARK_OPACITY = 0.24;
const DARK_WATERMARK_THRESHOLD = 145;
const SUPPORTED_FORMATS = new Set(["jpeg", "png", "webp"]);

export class DeckImageError extends Error {}

export type ProcessedDeckImage = {
  buffer: Buffer;
  height: number;
  watermarkColor: "black" | "white";
  width: number;
};

export async function processDeckImage(input: Buffer): Promise<ProcessedDeckImage> {
  if (input.length === 0 || input.length > MAX_INPUT_BYTES) {
    throw new DeckImageError("File DECK harus berukuran maksimal 20 MB.");
  }

  let metadata: Metadata;
  try {
    metadata = await sharp(input, { failOn: "warning", limitInputPixels: 144_000_000 }).metadata();
  } catch {
    throw new DeckImageError("File DECK bukan gambar yang valid.");
  }

  const { format, width = 0, height = 0 } = metadata;
  if (!format || !SUPPORTED_FORMATS.has(format)) {
    throw new DeckImageError("File DECK hanya boleh berupa JPEG, PNG, atau WebP.");
  }
  if (width < 1 || height < 1 || width > MAX_INPUT_DIMENSION || height > MAX_INPUT_DIMENSION) {
    throw new DeckImageError("Dimensi gambar DECK tidak valid atau melebihi 12000 px.");
  }

  const resized = await sharp(input, { failOn: "warning", limitInputPixels: 144_000_000 })
    .rotate()
    .resize({
      width: MAX_OUTPUT_DIMENSION,
      height: MAX_OUTPUT_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .toBuffer({ resolveWithObject: true });

  const outputWidth = resized.info.width;
  const outputHeight = resized.info.height;
  const sampleWidth = Math.max(1, Math.round(outputWidth * 0.5));
  const sampleHeight = Math.max(1, Math.round(outputHeight * 0.5));
  const sampleLeft = Math.max(0, Math.floor((outputWidth - sampleWidth) / 2));
  const sampleTop = Math.max(0, Math.floor((outputHeight - sampleHeight) / 2));
  const luminance = await sharp(resized.data)
    .extract({ left: sampleLeft, top: sampleTop, width: sampleWidth, height: sampleHeight })
    .flatten({ background: "#ffffff" })
    .greyscale()
    .resize(1, 1)
    .raw()
    .toBuffer();

  const watermarkColor = luminance[0] >= DARK_WATERMARK_THRESHOLD ? "black" : "white";
  const fontSize = Math.max(4, Math.min(outputWidth * 0.075, outputHeight * 0.18));
  const letterSpacing = fontSize * 0.08;
  const watermark = Buffer.from(`
    <svg width="${outputWidth}" height="${outputHeight}" xmlns="http://www.w3.org/2000/svg">
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central"
        font-family="Liberation Sans, Arial, Helvetica, sans-serif" font-size="${fontSize}"
        font-weight="700" letter-spacing="${letterSpacing}" fill="${watermarkColor}"
        fill-opacity="${WATERMARK_OPACITY}">UTERO ID</text>
    </svg>
  `);

  const result = await sharp(resized.data)
    .composite([{ input: watermark, left: 0, top: 0 }])
    .webp({ quality: 90, alphaQuality: 90, smartSubsample: true, effort: 6 })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: result.data,
    width: result.info.width,
    height: result.info.height,
    watermarkColor,
  };
}