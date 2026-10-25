
import type { Request, Response, NextFunction } from "express";
import { unlink } from "node:fs/promises";
import { prisma } from "../../utils/prisma.js";
import { customError } from "../../utils/customError.js";
import { generateUniqueSlug } from "../../utils/slug.js";
import { uploadCourseImageService } from "../../services/images/upload-course-image.service.js";

const createCourse = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  let filePath: string | undefined;

  try {
    const userId = request.user?.userId;

    if (!userId) {
      return next(customError("Please login first", 401));
    }

    const { title, description, price, categoryIds } = request.body;

    let imageUrl: string | null = null;

    if (request.file) {
      const uploadedImage = await uploadCourseImageService(request.file);

      imageUrl = uploadedImage.imageUrl;
      filePath = uploadedImage.filePath;
    }

    const slug = await generateUniqueSlug(title);

    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        price: String(price),
        image: imageUrl,
        teacherId: userId,
        ...(categoryIds?.length
          ? {
              categories: {
                connect: categoryIds.map((id: string) => ({ id })),
              },
            }
          : {}),
      },
      include: {
        categories: true,
      },
    });

    return response.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    if (filePath) {
      await unlink(filePath).catch(() => {});
    }

    next(error);
  }
};

export { createCourse };
