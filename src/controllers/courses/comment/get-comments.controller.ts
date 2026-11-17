import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../../utils/prisma.js";
import { customError } from "../../../utils/customError.js";
import { getPagination } from "../../../utils/pagination.js";

const getComments = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const courseId = request.params.courseId;

    if (typeof courseId !== "string") {
      return next(customError("Invalid course ID", 400));
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return next(customError("Course not found", 404));
    }

    const { page, limit, skip, take } = getPagination({
      page: request.query.page,
      limit: request.query.limit,
    });

    const [comments, total] = await Promise.all([
      prisma.courseComment.findMany({
        where: { courseId },
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            include: {
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          reactions: true,
        },
      }),
      prisma.courseComment.count({
        where: { courseId },
      }),
    ]);

    const formattedComments = comments.map((comment) => {
      const likesCount = comment.reactions.filter(
        (reaction) => reaction.type === "LIKE",
      ).length;

      const dislikesCount = comment.reactions.filter(
        (reaction) => reaction.type === "DISLIKE",
      ).length;

      const userReaction =
        comment.reactions.find(
          (reaction) => reaction.userId === request.user?.userId,
        )?.type ?? null;

      const { reactions, user, ...commentData } = comment;

      return {
        ...commentData,
        author: {
          firstName: user.profile?.firstName ?? null,
          lastName: user.profile?.lastName ?? null,
        },
        likesCount,
        dislikesCount,
        userReaction,
      };
    });

    return response.status(200).json({
      comments: formattedComments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return next(error);
  }
};

export { getComments };