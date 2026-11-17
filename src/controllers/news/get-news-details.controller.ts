import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";
import { customError } from "../../utils/customError.js";
import { calculateRating } from "../../utils/rating.js";

const getNewsDetails = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const userId = request.user?.userId;
    const newsId = request.params.newsId;

    if (!newsId || Array.isArray(newsId)) {
      return next(customError("Invalid News ID", 400));
    }

    if (!newsId) {
      return next(customError("News ID is required", 400));
    }

    const news = await prisma.news.findUnique({
      where: { id: newsId },
      include: {
        author: {
          select: {
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
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

    if (!news) {
      return next(customError("News not found", 404));
    }

    const ratingsCount = news.ratings.length;
    const averageRating = calculateRating(news.ratings);

    const likesCount = news.reactions.filter(
      (reaction) => reaction.type === "LIKE",
    ).length;

    const dislikesCount = news.reactions.filter(
      (reaction) => reaction.type === "DISLIKE",
    ).length;

    const userReaction = userId
      ? (news.reactions.find((reaction) => reaction.userId === userId)?.type ??
        null)
      : null;

    const { ratings, reactions, author, ...newsData } = news;

    return response.status(200).json({
      news: {
        ...newsData,
        author: author.profile,
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

export { getNewsDetails };
