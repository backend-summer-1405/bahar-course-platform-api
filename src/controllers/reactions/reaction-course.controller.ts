
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";
import { customError } from "../../utils/customError.js";
import { ReactionType } from "../../generated/prisma/client.js";

const reactToCourse = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const userId = request.user?.userId;
    const { courseId } = request.params;
    const { type } = request.body;

    if (!userId) {
      return next(customError("Unauthorized", 401));
    }

    if (type !== ReactionType.LIKE && type !== ReactionType.DISLIKE) {
      return next(customError("Invalid reaction type", 400));
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

    const reaction = await prisma.courseReaction.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      update: { type },
      create: {
        userId,
        courseId,
        type,
      },
    });

    return response.status(200).json({
      message: "Reaction saved successfully",
      reaction,
    });
  } catch (error) {
    next(error);
  }
};

export { reactToCourse };
