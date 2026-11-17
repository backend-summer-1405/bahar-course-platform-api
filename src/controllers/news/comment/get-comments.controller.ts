import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../../utils/prisma.js";
import { customError } from "../../../utils/customError.js";
import { getPagination } from "../../../utils/pagination.js";

const getNewsComments = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const newsId = request.params.newsId;

    if (typeof newsId !== "string") {
      return next(customError("Invalid news ID", 400));
    }

    const news = await prisma.news.findUnique({
      where: { id: newsId },
    });

    if (!news) {
      return next(customError("News not found", 404));
    }

    const { page, limit, skip, take } = getPagination({
      page: request.query.page,
      limit: request.query.limit,
    });

    const [comments, total] = await Promise.all([
      prisma.newsComment.findMany({
        where: { newsId },
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
      prisma.newsComment.count({
        where: { newsId },
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

export { getNewsComments };