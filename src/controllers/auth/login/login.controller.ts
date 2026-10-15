import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../../utils/prisma.js";
import { customError } from "../../../utils/customError.js";
import { comparePassword } from "../../../utils/hashPassword.js";
import { createJwtToken } from "../../../utils/jwtHelper.js";

const login = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const body = request.body;

  const checkUser = await prisma.user.findUnique({
    where: { email: body.email },
    include: {
      userRoles: {
        select: {
          role: true,
        },
      },
    },
  });

  if (!checkUser) {
    return next(customError("Invalid email or password", 401));
  }

  const isPasswordValid = await comparePassword(
    body.password,
    checkUser.password,
  );

  if (!isPasswordValid) {
    return next(customError("Invalid email or password", 401));
  }

  const roles = checkUser.userRoles.map((userRole) => userRole.role);

  const token = createJwtToken({
    userId: checkUser.id,
    email: checkUser.email,
    roles,
  });

  return response.status(200).json({
    message: "Login successful",
    token,
  });
};

export { login };
