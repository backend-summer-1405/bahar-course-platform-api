import { Router } from "express";
import { getProfile } from "../controllers/profile/get-profile.controller.js";
import { checkAuthentication } from "../middleware/checkAuthentication.middleware.js";
import { updateProfileValidator } from "../validator/profile.validator.js";
import { updateProfile } from "../controllers/profile/update-profile.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { uploadProfileImage } from "../controllers/profile/upload-profile-image.controller.js";
import { uploadProfileImageMiddleware } from "../middleware/upload-profile-image.middleware.js";
import { deleteProfileImage } from "../controllers/profile/delete-profile-image.controller.js";

const profileRouter = Router();

profileRouter.get("/me", checkAuthentication, getProfile);

profileRouter.patch(
  "/me",
  checkAuthentication,
  updateProfileValidator,
  validate,
  updateProfile,
);
profileRouter.post(
  "/me/images",
  checkAuthentication,
  uploadProfileImageMiddleware.single("image"),
  uploadProfileImage,
);

profileRouter.delete(
  "/me/images/:imageId",
  checkAuthentication,
  deleteProfileImage,
);

export { profileRouter };
