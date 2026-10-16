
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";
import { customError } from "../../utils/customError.js";

const updateProfile = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const userId = request.user?.userId;

    if (!userId) {
      return next(customError("Please login first", 401));
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        telegram: request.body.telegram,
        linkedin: request.body.linkedin,
        github: request.body.github,
        bio: request.body.bio,
        address: request.body.address,
        birthDate: request.body.birthDate
          ? new Date(request.body.birthDate)
          : request.body.birthDate,
      },
    });

    const isProfileComplete =
      Boolean(updatedProfile.firstName?.trim()) &&
      Boolean(updatedProfile.lastName?.trim()) &&
      Boolean(updatedProfile.address?.trim()) &&
      Boolean(updatedProfile.birthDate);

    if (isProfileComplete) {
      const studentRole = await prisma.userRole.findFirst({
        where: {
          userId,
          role: "STUDENT",
        },
      });

      if (!studentRole) {
        await prisma.userRole.create({
          data: {
            userId,
            role: "STUDENT",
          },
        });
      }
    }

    return response.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

export { updateProfile };
