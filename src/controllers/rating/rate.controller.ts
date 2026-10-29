import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";
import { customError } from "../../utils/customError.js";

const rateCourse = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const userId = request.user?.userId;
    const { courseId } = request.params;

    if (typeof courseId !== "string") {
      return next(customError("Invalid course ID", 400));
    }
    const { rating } = request.body;

    if (!userId) {
      return next(customError("Authentication required", 401));
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true },
    });

    if (!course) {
      return next(customError("Course not found", 404));
    }

    const courseRating = await prisma.courseRating.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      create: {
        userId,
        courseId,
        rating,
      },
      update: {
        rating,
      },
    });

    return response.status(200).json({
      message: "Course rating saved successfully",
      data: courseRating,
    });
  } catch (error) {
    return next(error);
  }
};

export { rateCourse };
