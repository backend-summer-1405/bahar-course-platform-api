import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../../utils/prisma.js";
import { customError } from "../../../utils/customError.js";
import { hashPassword } from "../../../utils/hashPassword.js";
import { createJwtToken } from "../../../utils/jwtHelper.js";

const setPassword = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const body = request.body;

  const pendingRegistration = await prisma.pendingRegistration.findUnique({
    where: { email: body.email },
  });

  if (!pendingRegistration) {
    return next(customError("Registration not found", 404));
  }

  if (!pendingRegistration.verifiedAt) {
    return next(customError("Please verify your email first", 400));
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (existingUser) {
    return next(customError("User already exists", 409));
  }

  const hashedPassword = await hashPassword(body.password);

  const newUser = await prisma.user.create({
    data: {
      email: body.email,
      password: hashedPassword,
      userRoles: {
        create: {
          role: "USER",
        },
      },
    },
    include: {
      userRoles: {
        select: {
          role: true,
        },
      },
    },
  });

  await prisma.pendingRegistration.delete({
    where: { email: body.email },
  });

  const roles = newUser.userRoles.map((userRole) => userRole.role);

  const token = createJwtToken({
    userId: newUser.id,
    email: newUser.email,
    roles,
  });

  return response.status(201).json({
    message: "Registration successful",
    token,
  });
};

export { setPassword };