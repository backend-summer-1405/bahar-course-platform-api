import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";
import { customError } from "../../utils/customError.js";
import { getPagination } from "../../utils/pagination.js";

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

const getMyReservations = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const userId = request.user?.userId;

    if (!userId) {
      return next(customError("Please login first", 401));
    }

    const { page, limit, skip, take } = getPagination({
      page: request.query.page,
      limit: request.query.limit,
    });

    const status =
      typeof request.query.status === "string"
        ? request.query.status
        : undefined;

    const allowedStatuses = [
      "PENDING",
      "AWAITING_PAYMENT",
      "REJECTED",
      "PAID",
      "EXPIRED",
      "CANCELLED",
    ];

    if (status !== undefined && !allowedStatuses.includes(status)) {
      return next(customError("Invalid reservation status", 400));
    }

    const where = {
      userId,
      ...(status && {
        status: status as
          | "PENDING"
          | "AWAITING_PAYMENT"
          | "REJECTED"
          | "PAID"
          | "EXPIRED"
          | "CANCELLED",
      }),
    };

    const [reservations, total] = await Promise.all([
      prisma.courseReservation.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              image: true,
              price: true,
            },
          },
        },
      }),

      prisma.courseReservation.count({ where }),
    ]);

    return response.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      reservations,
    });
  } catch (error) {
    return next(error);
  }
};

export { createReservation ,getMyReservations};
