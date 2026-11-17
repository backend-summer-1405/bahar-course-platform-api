import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../../utils/prisma.js";
import { customError } from "../../../utils/customError.js";

const createComment = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const userId = request.user?.userId;
    const { courseId } = request.params;
    const { content } = request.body;

    if (!userId) {
      return next(customError("Unauthorized", 401));
    }

    if (typeof courseId !== "string") {
      return next(customError("Invalid course ID", 400));
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true },
    });

    if (!course) {
      return next(customError("Course not found", 404));
    }

    const comment = await prisma.courseComment.create({
      data: {
        content,
        userId,
        courseId,
      },
    });

    return response.status(201).json({
      message: "Comment created successfully",
      comment,
    });
  } catch (error) {
    return next(error);
  }
};

export { createComment };
