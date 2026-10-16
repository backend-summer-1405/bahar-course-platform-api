import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../../utils/prisma.js";
import { customError } from "../../../utils/customError.js";
import { sendPasswordResetCode } from "../../../services/forgotPasswordService.js";

const forgetPassword = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
    const body = request.body
    const checkUser = await prisma.user.findUnique({
        where:{
            email:body.email
        }
    })
    if (!checkUser) {
    return next(customError("User dose not exists", 404));
  }
   await sendPasswordResetCode(body.email);

  return response.status(200).json({
    message: "Reset code sent successfully.",
  });
};
export { forgetPassword };