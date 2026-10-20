
import { Router } from "express";
import { checkAuthentication } from "../middleware/checkAuthentication.middleware.js";
import { checkAuthorization } from "../middleware/checkAuthorization.middleware.js";
import { getUsers } from "../controllers/admin/get-users.controller.js";
import { changeRole } from "../controllers/admin/change-role.controller.js";
import { removeRole } from "../controllers/admin/remove-role.controller.js";
import { updateUserProfileValidator } from "../validator/profile.validator.js";
import { validate } from "../middleware/validate.middleware.js";
import { updateUserProfile } from "../controllers/admin/update-user-profile.controller.js";

const adminRouter = Router();

adminRouter.get(
  "/users",
  checkAuthentication,
  checkAuthorization("ADMIN"),
  getUsers,
);

adminRouter.patch(
  "/users/:userId/roles",
  checkAuthentication,
  checkAuthorization("ADMIN"),
  changeRole,
);

adminRouter.delete(
  "/users/:userId/roles/:role",
  checkAuthentication,
  checkAuthorization("ADMIN"),
  removeRole,
);
adminRouter.patch(
  "/users/:userId",
  checkAuthentication,
  checkAuthorization("ADMIN"),
  updateUserProfileValidator,
  validate,
  updateUserProfile,
);
export { adminRouter };
