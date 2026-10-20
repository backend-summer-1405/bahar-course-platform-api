import type { Request, Response, NextFunction } from "express";
import { customError } from "../../utils/customError.js";
import { deleteProfileImageService } from "../../services/images/delete-profile-image.service.js";

const deleteProfileImage = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const userId = request.user?.userId;
    const imageId = request.params.imageId;

    if (typeof imageId !== "string" || !imageId) {
      return next(customError("Invalid image ID", 400));
    }

    if (!userId) {
      return next(customError("Please login first", 401));
    }

    if (!imageId) {
      return next(customError("Image ID is required", 400));
    }

    await deleteProfileImageService(userId, imageId);

    return response.status(200).json({
      message: "Profile image deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export { deleteProfileImage };
