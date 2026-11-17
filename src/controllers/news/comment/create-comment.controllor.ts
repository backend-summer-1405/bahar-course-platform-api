import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../../utils/prisma.js";
import { customError } from "../../../utils/customError.js";

const createNewsComment = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const userId = request.user?.userId;
    const { newsId } = request.params;
    const { content } = request.body;

    if (!userId) {
      return next(customError("Unauthorized", 401));
    }

    if (typeof newsId !== "string") {
      return next(customError("Invalid news ID", 400));
    }

    const news = await prisma.news.findUnique({
      where: { id: newsId },
      select: { id: true },
    });

    if (!news) {
      return next(customError("News not found", 404));
    }

    const comment = await prisma.newsComment.create({
      data: {
        content,
        userId,
        newsId,
      },
    });

    return response.status(201).json({
      message: "Comment created successfully",
      comment,
    });
  } catch (error) {
    return next(error);
  }
};

export { createNewsComment };