
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";

const getCourses = async (
  _request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        categories: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return response.status(200).json({
      message: "Courses retrieved successfully",
      count: courses.length,
      courses,
    });
  } catch (error) {
    return next(error);
  }
};

export { getCourses };
