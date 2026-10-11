import type { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prisma.js";
import { customError } from "../utils/customError.js";
import { hashPassword } from "../utils/hashPassword.js";
import { createJwtToken } from "../utils/jwtHelper.js";

const register = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const body = request.body;
  const checkUser = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });
 if (checkUser) {
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

const roles = newUser.userRoles.map((userRole) => userRole.role);
  const token = createJwtToken({
    id: newUser.id,
    roles,
  });

  return response.status(201).json({
    message: "Registration successful",
    user: {
      id: newUser.id,
      email: newUser.email,
      roles,
    },
    token,
  });
};

export { register };
