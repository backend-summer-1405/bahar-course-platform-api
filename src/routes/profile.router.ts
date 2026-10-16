import { Router } from "express";
import { getProfile } from "../controllers/profile/get-profile.controller.js";
import { checkAuthentication } from "../middleware/checkAuthentication.middleware.js";
import { updateProfileValidator } from "../validator/profile.validator.js";
import { updateProfile } from "../controllers/profile/update-profile.controller.js";
import { validate } from "../middleware/validate.middleware.js";

const profileRouter = Router();

profileRouter.get("/me", checkAuthentication, getProfile);

profileRouter.patch(
  "/me",
  checkAuthentication,
  updateProfileValidator,
  validate,
  updateProfile,
);

export { profileRouter };
