import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";
import { customError } from "../../utils/customError.js";

const getCourseDetails = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const slug = request.params.slug;

    if (typeof slug !== "string") {
      return next(customError("Invalid course slug", 400));
    }

    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        teacher: {
          select: {
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        categories: true,
        ratings: {
          select: {
            rating: true,
          },
        },
        reactions: {
          select: {
            type: true,
            userId: true,
          },
        },
      },
    });

    if (!course) {
      return next(customError("Course not found", 404));
    }

    const ratingsCount = course.ratings.length;

    const averageRating =
      ratingsCount > 0
        ? course.ratings.reduce((sum, item) => sum + item.rating, 0) /
          ratingsCount
        : null;

    const likesCount = course.reactions.filter(
      (reaction) => reaction.type === "LIKE",
    ).length;

    const dislikesCount = course.reactions.filter(
      (reaction) => reaction.type === "DISLIKE",
    ).length;

    const userReaction =
      course.reactions.find(
        (reaction) => reaction.userId === request.user?.userId,
      )?.type ?? null;

    const { ratings, reactions, teacher, ...courseData } = course;

    return response.status(200).json({
      course: {
        ...courseData,
        teacher: {
          firstName: teacher.profile?.firstName ?? null,
          lastName: teacher.profile?.lastName ?? null,
        },
        averageRating,
        ratingsCount,
        likesCount,
        dislikesCount,
        userReaction,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export { getCourseDetails };