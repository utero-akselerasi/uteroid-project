import sharp, { type Metadata } from "sharp";

const MAX_INPUT_BYTES = 20 * 1024 * 1024;
const MAX_INPUT_DIMENSION = 12_000;
const MAX_OUTPUT_DIMENSION = 3_840;
const SUPPORTED_FORMATS = new Set(["jpeg", "png", "webp"]);

export class DeckImageError extends Error {}

export type ProcessedDeckImage = {
  buffer: Buffer;
  height: number;
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

  const result = await sharp(resized.data)
    .webp({ quality: 90, alphaQuality: 90, smartSubsample: true, effort: 6 })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: result.data,
    width: result.info.width,
    height: result.info.height,
  };
}