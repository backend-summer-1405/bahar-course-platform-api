import type { NextFunction, Request, Response } from "express";
import { customError } from "../../../utils/customError.js";
import { prisma } from "../../../utils/prisma.js";
import { comparePassword } from "../../../utils/hashPassword.js";

const verifyResetCode = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const body = request.body;

  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (!user) {
    return next(customError("Invalid verification code", 400));
  }

  const resetCode = await prisma.verificationCode.findFirst({
    where: {
      userId: user.id,
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

  const isResetCodeValid = await comparePassword(
    body.code,
    resetCode.codeHash,
  );

  if (!isResetCodeValid) {
    return next(customError("Invalid verification code", 400));
  }

  return response.status(200).json({
    message: "Reset code verified successfully.",
  });
};

export { verifyResetCode };