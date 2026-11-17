import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";
import { customError } from "../../utils/customError.js";
import { ReactionType } from "../../generated/prisma/client.js";

const reactToNews = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const userId = request.user?.userId;
    const { newsId } = request.params;
    const { type } = request.body;

    if (!userId) {
      return next(customError("Unauthorized", 401));
    }

    if (type !== ReactionType.LIKE && type !== ReactionType.DISLIKE) {
      return next(customError("Invalid reaction type", 400));
    }

    if (typeof newsId !== "string") {
      return next(customError("Invalid news ID", 400));
    }

    const news = await prisma.news.findUnique({
      where: { id: newsId },
    });

    if (!news) {
      return next(customError("News not found", 404));
    }

    const reaction = await prisma.newsReaction.upsert({
      where: {
        userId_newsId: {
          userId,
          newsId,
        },
      },
      update: { type },
      create: {
        userId,
        newsId,
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

export { reactToNews };