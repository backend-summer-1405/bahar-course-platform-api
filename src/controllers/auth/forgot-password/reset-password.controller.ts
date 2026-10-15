import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../../utils/prisma.js";
import { customError } from "../../../utils/customError.js";
import { hashPassword, comparePassword } from "../../../utils/hashPassword.js";

const resetPassword = async (
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

  if (!checkUser) {
    return next(customError("Invalid request", 400));
  }

  const resetCode = await prisma.verificationCode.findFirst({
    where: {
      userId: checkUser.id,
      type: "PASSWORD_RESET",
      usedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!resetCode) {
    return next(customError("Invalid or expired verification code", 400));
  }

  const isResetCodeValid = await comparePassword(body.code, resetCode.codeHash);

  if (!isResetCodeValid) {
    return next(customError("Invalid verification code", 400));
  }

  const hashedPassword = await hashPassword(body.password);

  await prisma.user.update({
    where: {
      id: checkUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  await prisma.verificationCode.update({
    where: {
      id: resetCode.id,
    },
    data: {
      usedAt: new Date(),
    },
  });

  return response.status(200).json({
    message: "Password reset successfully.",
  });
};

export { resetPassword };
