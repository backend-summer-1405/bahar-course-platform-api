
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";
import { customError } from "../../utils/customError.js";

const getProfile = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const userId = request.user?.userId;

    if (!userId) {
      return next(customError("Please login first", 401));
    }

    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        images: true,
      },
    });

    if (!profile) {
      return next(customError("Profile not found", 404));
    }

    return response.status(200).json({
      profile,
    });
  } catch (error) {
    next(error);
  }
};

export { getProfile };
