
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";
import { customError } from "../../utils/customError.js";
import { generateUniqueNewsSlug } from "../../utils/slug.js";

const createNews = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const userId = request.user?.userId;

    if (!userId) {
      return next(customError("Please login first", 401));
    }

    const { title, content } = request.body;

    const slug = await generateUniqueNewsSlug(title);

    const news = await prisma.news.create({
      data: {
        title,
        slug,
        content,
        authorId: userId,
      },
    });

    return response.status(201).json({
      message: "News created successfully",
      news,
    });
  } catch (error) {
    return next(error);
  }
};

export { createNews };
