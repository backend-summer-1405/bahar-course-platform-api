import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";
import { customError } from "../../utils/customError.js";

const deleteNews = async (
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

    if (!userId) {
      return next(customError("Please login first", 401));
    }

    if (!newsId) {
      return next(customError("News ID is required", 400));
    }

    const news = await prisma.news.findUnique({
      where: { id: newsId },
    });

    if (!news) {
      return next(customError("News not found", 404));
    }

    const isAdmin = request.user?.roles?.includes("ADMIN");
    const isAuthor = news.authorId === userId;

    if (!isAdmin && !isAuthor) {
      return next(customError("You are not allowed to delete this news", 403));
    }

    await prisma.news.delete({
      where: { id: newsId },
    });

    return response.status(200).json({
      message: "News deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

export { deleteNews };
