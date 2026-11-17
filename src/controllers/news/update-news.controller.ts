import type { Request, Response, NextFunction } from "express";
import { customError } from "../../utils/customError.js";
import { generateUniqueNewsSlug } from "../../utils/slug.js";
import { prisma } from "../../utils/prisma.js";

const updateNews = async (
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
      return next(customError("You are not allowed to update this news", 403));
    }

    const { title, content } = request.body;

    const data: {
      title?: string;
      slug?: string;
      content?: string;
    } = {};

    if (title !== undefined && title !== news.title) {
      data.title = title;
      data.slug = await generateUniqueNewsSlug(title);
    }

    if (content !== undefined) {
      data.content = content;
    }

    const updatedNews = await prisma.news.update({
      where: { id: newsId },
      data,
    });

    return response.status(200).json({
      message: "News updated successfully",
      news: updatedNews,
    });
  } catch (error) {
    return next(error);
  }
};

export { updateNews };
