
import { validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";

const validate = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return response.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
};

export { validate };
