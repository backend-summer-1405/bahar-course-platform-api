import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../../utils/prisma.js";
import { customError } from "../../../utils/customError.js";
import { comparePassword } from "../../../utils/hashPassword.js";

const verifyEmail = async (
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

  if (pendingRegistration.verifiedAt) {
    return next(customError("Email already verified", 400));
  }

  if (pendingRegistration.expiresAt < new Date()) {
    return next(customError("Verification code has expired", 400));
  }

  if (pendingRegistration.attempts >= 5) {
    return next(customError("Too many verification attempts", 429));
  }

  const isCodeValid = await comparePassword(
    body.code,
    pendingRegistration.codeHash,
  );

  if (!isCodeValid) {
    await prisma.pendingRegistration.update({
      where: { email: body.email },
      data: { attempts: { increment: 1 } },
    });

    return next(customError("Invalid verification code", 400));
  }

  await prisma.pendingRegistration.update({
    where: { email: body.email },
    data: { verifiedAt: new Date() },
  });

  return response.status(200).json({
    message: "Email verified successfully.",
  });
};

export { verifyEmail };
