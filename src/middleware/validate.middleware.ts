
import { validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import { customError } from "../utils/customError.js";

const validate = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return next(customError("validation failed", 400));
  }

  next();
};

export { validate };
