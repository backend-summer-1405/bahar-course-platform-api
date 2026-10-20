
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";
import { customError } from "../../utils/customError.js";

const updateUserProfile = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const userId = request.params.userId;

    if (typeof userId !== "string" || !userId) {
      return next(customError("Invalid user ID", 400));
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        profile: {
          select: { id: true },
        },
      },
    });

    if (!user) {
      return next(customError("User not found", 404));
    }

    if (!user.profile) {
      return next(customError("Profile not found", 404));
    }

    const {
      firstName,
      lastName,
      telegram,
      linkedin,
      github,
      bio,
      address,
      birthDate,
    } = request.body;

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(telegram !== undefined && { telegram }),
        ...(linkedin !== undefined && { linkedin }),
        ...(github !== undefined && { github }),
        ...(bio !== undefined && { bio }),
        ...(address !== undefined && { address }),
        ...(birthDate !== undefined && {
          birthDate: birthDate === null ? null : new Date(birthDate),
        }),
      },
    });

    return response.status(200).json({
      message: "User profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

export { updateUserProfile };
