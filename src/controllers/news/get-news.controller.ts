import type { Request, Response, NextFunction } from "express";
import { customError } from "../../utils/customError.js";
import { getPagination } from "../../utils/pagination.js";
import { calculateRating } from "../../utils/rating.js";
import type { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../utils/prisma.js";

const getNews = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const userId = request.user?.userId;

    const { page, limit, skip } = getPagination({
      page: request.query.page,
      limit: request.query.limit,
    });

    const search = request.query.search?.toString().trim();

    const sortBy = request.query.sortBy?.toString() || "createdAt";
    const order = request.query.order?.toString() || "desc";

    if (!["createdAt", "rating"].includes(sortBy)) {
      return next(customError("Invalid sortBy value", 400));
    }

    if (!["asc", "desc"].includes(order)) {
      return next(customError("Invalid order value", 400));
    }

    const where = search
      ? {
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              content: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {};

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: order as Prisma.SortOrder,
        },
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
      }),
      prisma.news.count({ where }),
    ]);

    const formattedNews = news.map((item) => {
      const ratingsCount = item.ratings.length;
      const averageRating = calculateRating(item.ratings);

      const likesCount = item.reactions.filter(
        (reaction) => reaction.type === "LIKE",
      ).length;

      const dislikesCount = item.reactions.filter(
        (reaction) => reaction.type === "DISLIKE",
      ).length;

      const userReaction = userId
        ? (item.reactions.find((reaction) => reaction.userId === userId)
            ?.type ?? null)
        : null;

      const { ratings, reactions, author, ...newsData } = item;

      return {
        ...newsData,
        author: author.profile,
        averageRating,
        ratingsCount,
        likesCount,
        dislikesCount,
        userReaction,
      };
    });

    if (sortBy === "rating") {
      formattedNews.sort((a, b) => {
        const ratingA = a.averageRating.averageRating ?? 0;
        const ratingB = b.averageRating.averageRating ?? 0;

        return order === "asc" ? ratingA - ratingB : ratingB - ratingA;
      });
    }

    return response.status(200).json({
      news: formattedNews,
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

export { getNews };
