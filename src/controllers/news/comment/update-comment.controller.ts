import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../../utils/prisma.js";
import { customError } from "../../../utils/customError.js";

const updateNewsComment = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const userId = request.user?.userId;
    const { newsId, commentId } = request.params;
    const { content } = request.body;

    if (!userId) {
      return next(customError("Unauthorized", 401));
    }

    if (typeof newsId !== "string" || typeof commentId !== "string") {
      return next(customError("Invalid ID", 400));
    }

    const comment = await prisma.newsComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return next(customError("Comment not found", 404));
    }

    if (comment.newsId !== newsId) {
      return next(customError("Comment not found in this news", 404));
    }

    if (comment.userId !== userId) {
      return next(customError("You cannot edit this comment", 403));
    }

    const updatedComment = await prisma.newsComment.update({
      where: { id: commentId },
      data: { content },
    });

    return response.status(200).json({
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (error) {
    return next(error);
  }
};

export { updateNewsComment };