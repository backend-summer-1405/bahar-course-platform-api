import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../../utils/prisma.js";
import { customError } from "../../../utils/customError.js";

const deleteNewsComment = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const userId = request.user?.userId;
    const { newsId, commentId } = request.params;

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
      return next(customError("You cannot delete this comment", 403));
    }

    await prisma.newsComment.delete({
      where: { id: commentId },
    });

    return response.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

export { deleteNewsComment };