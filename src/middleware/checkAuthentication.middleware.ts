import type { Request, Response, NextFunction } from "express";
import { checkJwtToken } from "../utils/jwtHelper.js";
import { customError } from "../utils/customError.js";

const checkAuthentication = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return next(customError("Please login first", 401));
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    return next(customError("Please login first", 401));
  }

  try {
    const verifiedToken = checkJwtToken(token);

    if (!verifiedToken) {
      return next(customError("Token is not valid", 401));
    }

    request.user = verifiedToken;

    next();
  } catch {
    next(customError("Token is not valid", 401));
  }
};

const optionalAuthentication = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const authorization = request.headers.authorization;

  if (!authorization) {
    return next();
  }

  if (!authorization.startsWith("Bearer ")) {
    return next(customError("Token is not valid", 401));
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    return next(customError("Token is not valid", 401));
  }

  try {
    const verifiedToken = checkJwtToken(token);

    if (!verifiedToken) {
      return next(customError("Token is not valid", 401));
    }

    request.user = verifiedToken;

    next();
  } catch {
    next(customError("Token is not valid", 401));
  }
};

export { checkAuthentication, optionalAuthentication };
