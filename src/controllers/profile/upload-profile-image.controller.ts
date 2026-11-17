
import type { Request, Response, NextFunction } from "express";
import { customError } from "../../utils/customError.js";
import { uploadProfileImageService } from "../../services/images/upload-profile-image.service.js";

const uploadProfileImage = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const userId = request.user?.userId;

    if (!userId) {
      return next(customError("Please login first", 401));
    }

    if (!request.file) {
      return next(customError("Please select an image", 400));
    }

    const image = await uploadProfileImageService(userId, request.file);

    return response.status(201).json({
      message: "Profile image uploaded successfully",
      image,
    });
  } catch (error) {
    next(error);
  }
};

export { uploadProfileImage };
