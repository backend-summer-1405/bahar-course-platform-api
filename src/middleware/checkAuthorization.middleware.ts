
import type { NextFunction, Request, Response } from "express";
import { customError } from "../utils/customError.js";

const checkAuthorization = (...roles: string[]) => {
  return (request: Request, response: Response, next: NextFunction) => {
    const user = request.user;

    if (!user) {
      return next(customError("Please login first", 401));
    }

    if (!roles.some((role) => user.roles?.includes(role))) {
      return next(
        customError("You don't have access to this action", 403),
      );
    }

    next();
  };
};

export { checkAuthorization };
