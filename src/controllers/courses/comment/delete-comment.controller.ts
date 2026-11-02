import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../../utils/prisma.js";
import { customError } from "../../../utils/customError.js";

const deleteComment = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const userId = request.user?.userId;
    const { courseId, commentId } = request.params;

    if (!userId) {
      return next(customError("Unauthorized", 401));
    }

    if (typeof courseId !== "string" || typeof commentId !== "string") {
      return next(customError("Invalid ID", 400));
    }

    const comment = await prisma.courseComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return next(customError("Comment not found", 404));
    }

    if (comment.courseId !== courseId) {
      return next(customError("Comment not found in this course", 404));
    }

    if (comment.userId !== userId) {
      return next(customError("You cannot delete this comment", 403));
    }

    await prisma.courseComment.delete({
      where: { id: commentId },
    });

    return response.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

export { deleteComment };