import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";
import { customError } from "../../utils/customError.js";

const rateNews = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const userId = request.user?.userId;
    const { newsId } = request.params;

    if (typeof newsId !== "string") {
      return next(customError("Invalid news ID", 400));
    }

    const { rating } = request.body;

    if (!userId) {
      return next(customError("Authentication required", 401));
    }

    const news = await prisma.news.findUnique({
      where: { id: newsId },
      select: { id: true },
    });

    if (!news) {
      return next(customError("News not found", 404));
    }

    const newsRating = await prisma.newsRating.upsert({
      where: {
        userId_newsId: {
          userId,
          newsId,
        },
      },
      create: {
        userId,
        newsId,
        rating,
      },
      update: {
        rating,
      },
    });

    return response.status(200).json({
      message: "News rating saved successfully",
      data: newsRating,
    });
  } catch (error) {
    return next(error);
  }
};

export { rateNews };