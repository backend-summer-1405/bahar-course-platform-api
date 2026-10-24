
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";
import { customError } from "../../utils/customError.js";

const createCourse = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const userId = request.user?.userId;

    if (!userId) {
      return next(customError("Please login first", 401));
    }

    const { title, description, price, image, categoryIds } = request.body;

const course = await prisma.course.create({
  data: {
    title,
    slug: title.trim().toLowerCase().replace(/\s+/g, "-"),
    description,
    price: String(price),
    image: image ?? null,
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
    next(error);
  }
};

export { createCourse };
