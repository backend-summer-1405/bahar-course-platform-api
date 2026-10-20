
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../utils/prisma.js";

const getUsers = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        emailVerifiedAt: true,
        createdAt: true,
        userRoles: {
          select: {
            role: true,
          },
        },
        profile: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      emailVerifiedAt: user.emailVerifiedAt,
      createdAt: user.createdAt,
      profile: user.profile,
      roles: user.userRoles.map((userRole) => userRole.role),
    }));

    return response.status(200).json({
      users: formattedUsers,
    });
  } catch (error) {
    next(error);
  }
};

export { getUsers };
