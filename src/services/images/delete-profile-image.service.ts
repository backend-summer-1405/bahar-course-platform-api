
import { unlink } from "node:fs/promises";
import path from "node:path";
import { prisma } from "../../utils/prisma.js";
import { customError } from "../../utils/customError.js";

const deleteProfileImageService = async (
  userId: string,
  imageId: string,
) => {
  const image = await prisma.userImage.findFirst({
    where: {
      id: imageId,
      profile: {
        userId,
      },
    },
  });

  if (!image) {
    throw customError("Image not found", 404);
  }

  const fileName = path.basename(image.url);

  const filePath = path.join(
    process.cwd(),
    "uploads",
    "profiles",
    fileName,
  );

  await prisma.userImage.delete({
    where: {
      id: image.id,
    },
  });

  try {
    await unlink(filePath);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code !== "ENOENT"
    ) {
      throw error;
    }
  }

  return image;
};

export { deleteProfileImageService };
