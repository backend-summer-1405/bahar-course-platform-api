
import { unlink } from "node:fs/promises";
import { prisma } from "../../utils/prisma.js";
import { customError } from "../../utils/customError.js";
import { processImageService } from "./process-image.service.js";

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

  const { imageUrl, filePath } = await processImageService(file, {
    directory: "profiles",
    width: 800,
    height: 800,
  });

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
