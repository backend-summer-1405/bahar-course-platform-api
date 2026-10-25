import type { Request, Response, NextFunction } from "express";
import { unlink } from "node:fs/promises";
import { prisma } from "../../utils/prisma.js";
import { customError } from "../../utils/customError.js";
import { generateUniqueSlug } from "../../utils/slug.js";
import { uploadCourseImageService } from "../../services/images/upload-course-image.service.js";

const updateCourse = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  let newImagePath: string | undefined;

  try {
    const userId = request.user?.userId;
    const courseId = request.params.courseId;

    if (typeof courseId !== "string") {
      return next(customError("Invalid course ID", 400));
    }

    if (!userId) {
      return next(customError("Please login first", 401));
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return next(customError("Course not found", 404));
    }

    const isAdmin = request.user?.roles?.includes("ADMIN");
    const isTeacher = course.teacherId === userId;

    if (!isAdmin && !isTeacher) {
      return next(
        customError("You are not allowed to update this course", 403),
      );
    }

    const { title, description, price, categoryIds } = request.body;

    const data: {
      title?: string;
      slug?: string;
      description?: string;
      price?: string;
      image?: string | null;
      categories?: {
        set: { id: string }[];
      };
    } = {};

    if (title !== undefined) {
      data.title = title;
      data.slug = await generateUniqueSlug(title);
    }

    if (description !== undefined) {
      data.description = description;
    }

    if (price !== undefined) {
      data.price = String(price);
    }

    if (categoryIds !== undefined) {
      data.categories = {
        set: categoryIds.map((id: string) => ({ id })),
      };
    }

    if (request.file) {
      const uploadedImage = await uploadCourseImageService(request.file);
      newImagePath = uploadedImage.filePath;
      data.image = uploadedImage.imageUrl;
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data,
      include: { categories: true },
    });

    if (newImagePath && course.image) {
      const oldImagePath = course.image.startsWith("/uploads/")
        ? `${process.cwd()}${course.image}`
        : undefined;

      if (oldImagePath) {
        await unlink(oldImagePath).catch(() => {});
      }
    }

    return response.status(200).json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    if (newImagePath) {
      await unlink(newImagePath).catch(() => {});
    }

    return next(error);
  }
};

export { updateCourse };
