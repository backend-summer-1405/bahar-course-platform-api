
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";
import { customError } from "../../utils/customError.js";

const allowedRoles = ["USER", "TEACHER", "ADMIN", "STUDENT"] as const;

const changeRole = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const userId = request.params.userId;
    const { role } = request.body;

    if (typeof userId !== "string" || !userId) {
      return next(customError("Invalid user ID", 400));
    }

    if (
      typeof role !== "string" ||
      !allowedRoles.includes(role as (typeof allowedRoles)[number])
    ) {
      return next(customError("Invalid role", 400));
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return next(customError("User not found", 404));
    }

    const existingRole = await prisma.userRole.findUnique({
      where: {
        userId_role: {
          userId,
          role: role as (typeof allowedRoles)[number],
        },
      },
    });

    if (existingRole) {
      return next(customError("User already has this role", 409));
    }

    const userRole = await prisma.userRole.create({
      data: {
        userId,
        role: role as (typeof allowedRoles)[number],
      },
    });

    return response.status(201).json({
      message: "Role added successfully",
      userRole,
    });
  } catch (error) {
    next(error);
  }
};

export { changeRole };
