
import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { customError } from "../../utils/customError.js";

type ProcessImageOptions = {
  directory: string;
  width: number;
  height: number;
};

const processImageService = async (
  file: Express.Multer.File,
  options: ProcessImageOptions,
) => {
  const metadata = await sharp(file.buffer).metadata();

  const allowedFormats = ["jpeg", "png", "webp"];

  if (!metadata.format || !allowedFormats.includes(metadata.format)) {
    throw customError("Invalid image format", 400);
  }

  const uploadDirectory = path.join(
    process.cwd(),
    "uploads",
    options.directory,
  );

  await mkdir(uploadDirectory, { recursive: true });

  const fileName = `${randomUUID()}.webp`;
  const filePath = path.join(uploadDirectory, fileName);
  const imageUrl = `/uploads/${options.directory}/${fileName}`;

  await sharp(file.buffer, {
    limitInputPixels: 40_000_000,
  })
    .rotate()
    .resize({
      width: options.width,
      height: options.height,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toFile(filePath);

  return { imageUrl, filePath };
};

export { processImageService };
