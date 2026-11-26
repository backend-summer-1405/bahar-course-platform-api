import { Router } from "express";
import { createCategoryValidator } from "../validator/category.validator.js";
import { createCategory } from "../controllers/category/category.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { checkAuthorization } from "../middleware/checkAuthorization.middleware.js";
import { checkAuthentication } from "../middleware/checkAuthentication.middleware.js";

const categoryRoutes = Router();

categoryRoutes.post(
  "/",
  createCategoryValidator,
  checkAuthentication,
  checkAuthorization("ADMIN"),
  createCategoryValidator,
  validate,
  createCategory,
);

export default categoryRoutes;
