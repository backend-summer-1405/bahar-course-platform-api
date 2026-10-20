
import { randomUUID } from "node:crypto";
import { mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { prisma } from "../../utils/prisma.js";
import { customError } from "../../utils/customError.js";


const uploadProfileImageService = async (
  userId: string,
  file: Express.Multer.File,
) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) {
    throw customError("Profile not found", 404);
  }

  const metadata = await sharp(file.buffer).metadata();

  const allowedFormats = ["jpeg", "png", "webp"];

  if (!metadata.format || !allowedFormats.includes(metadata.format)) {
    throw customError("Invalid image format", 400);
  }

  const uploadDirectory = path.join(
    process.cwd(),
    "uploads",
    "profiles",
  );

  await mkdir(uploadDirectory, { recursive: true });

  const fileName = `${randomUUID()}.webp`;
  const filePath = path.join(uploadDirectory, fileName);
  const imageUrl = `/uploads/profiles/${fileName}`;

  await sharp(file.buffer, {
    limitInputPixels: 40_000_000,
  })
    .rotate()
    .resize({
      width: 800,
      height: 800,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toFile(filePath);

  try {
    const image = await prisma.userImage.create({
      data: {
        url: imageUrl,
        profileId: profile.id,
      },
    });

    return image;
  } catch (error) {
    await unlink(filePath).catch(() => {});
    throw error;
  }
};

export { uploadProfileImageService };
