
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";
import { customError } from "../../utils/customError.js";

const allowedRoles = ["USER", "TEACHER", "ADMIN", "STUDENT"] as const;

const removeRole = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { userId, role } = request.params;
    const currentUserId = request.user?.userId;

    if (
      typeof userId !== "string" ||
      typeof role !== "string" ||
      !userId ||
      !role
    ) {
      return next(customError("Invalid user ID or role", 400));
    }

    if (!allowedRoles.includes(role as (typeof allowedRoles)[number])) {
      return next(customError("Invalid role", 400));
    }

    if (role === "ADMIN" && userId === currentUserId) {
      return next(
        customError("You cannot remove your own ADMIN role", 403),
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return next(customError("User not found", 404));
    }

    // Check whether the user has the requested role.
    const userRole = await prisma.userRole.findFirst({
      where: {
        userId,
        role: role as (typeof allowedRoles)[number],
      },
      select: { id: true },
    });

    if (!userRole) {
      return next(customError("User does not have this role", 404));
    }

    // Prevent removing the last ADMIN.
    if (role === "ADMIN") {
      const adminCount = await prisma.userRole.count({
        where: { role: "ADMIN" },
      });

      if (adminCount <= 1) {
        return next(
          customError("Cannot remove the last ADMIN", 403),
        );
      }
    }

    const result = await prisma.userRole.deleteMany({
      where: {
        userId,
        role: role as (typeof allowedRoles)[number],
      },
    });

    if (result.count === 0) {
      return next(customError("User does not have this role", 404));
    }

    return response.status(200).json({
      message: "Role removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export { removeRole };
