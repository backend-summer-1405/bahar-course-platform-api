import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";
import { customError } from "../../utils/customError.js";

const createReservation = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const userId = request.user?.userId;

    if (!userId) {
      return next(customError("Please login first", 401));
    }

    const courseId = request.params.courseId;

    if (typeof courseId !== "string") {
      return next(customError("Invalid course ID", 400));
    }

    if (!courseId) {
      return next(customError("Course ID is required", 400));
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return next(customError("Course not found", 404));
    }

    if (!course.isActive) {
      return next(customError("This course is not active", 400));
    }

    if (course.teacherId === userId) {
      return next(customError("You cannot reserve your own course", 403));
    }

    const existingReservation = await prisma.courseReservation.findFirst({
      where: {
        userId,
        courseId,
        status: {
          in: ["PENDING", "AWAITING_PAYMENT"],
        },
      },
    });

    if (existingReservation) {
      return next(
        customError(
          "You already have an active reservation for this course",
          409,
        ),
      );
    }

    const reservation = await prisma.courseReservation.create({
      data: {
        userId,
        courseId,
        amount: course.price,
      },
    });

    return response.status(201).json({
      message: "Course reservation created successfully",
      reservation,
    });
  } catch (error) {
    next(error);
  }
};

export { createReservation };
