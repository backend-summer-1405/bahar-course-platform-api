import type { Request, Response, NextFunction } from "express";

type CustomError = Error & {
  statusCode?: number;
};

const errorMiddleware = (
  error: CustomError,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const statusCode = error.statusCode || 500;

  response.status(statusCode).json({
    status: statusCode,
    message: error.message,
  });
};

export { errorMiddleware };