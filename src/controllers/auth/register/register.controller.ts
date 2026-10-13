import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../../utils/prisma.js";
import { customError } from "../../../utils/customError.js";
import { sendVerificationCode } from "../../../services/emailVerificationService.js";

const register = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { email } = request.body;

  const checkUser = await prisma.user.findUnique({
    where: { email },
  });

  if (checkUser) {
    return next(customError("User already exists", 409));
  }

  await sendVerificationCode(email);

  return response.status(200).json({
    message: "Verification code sent successfully.",
  });
};

export { register };