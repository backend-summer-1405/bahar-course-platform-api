
import type { Request, Response, NextFunction } from "express";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { prisma } from "../../utils/prisma.js";
import { customError } from "../../utils/customError.js";

const deleteCourse = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const userId = request.user?.userId;
    const courseId = request.params.courseId;

    if (!userId) {
      return next(customError("Please login first", 401));
    }

    if (typeof courseId !== "string") {
      return next(customError("Invalid course ID", 400));
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
        customError("You are not allowed to delete this course", 403),
      );
    }

    await prisma.course.delete({
      where: { id: courseId },
    });

    if (course.image?.startsWith("/uploads/courses/")) {
      const imagePath = path.join(process.cwd(), course.image);

      await unlink(imagePath).catch((error: NodeJS.ErrnoException) => {
        if (error.code !== "ENOENT") {
          console.error("Failed to delete course image:", error);
        }
      });
    }

    return response.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

export { deleteCourse };
