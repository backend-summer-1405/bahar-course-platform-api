import { Router } from "express";
import { createCategoryValidator, updateCategoryValidator } from "../validator/category.validator.js";
import { createCategory, deleteCategory, getAllCategories, updateCategory } from "../controllers/category/category.controller.js";
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

categoryRoutes.get("/", getAllCategories);

categoryRoutes.patch(
  "/:categoryId",
  checkAuthentication,
  checkAuthorization("ADMIN"),
  updateCategoryValidator,
  validate,
  updateCategory,
);
categoryRoutes.delete(
  "/:categoryId",
  checkAuthentication,
  checkAuthorization("ADMIN"),
  deleteCategory,
);
export default categoryRoutes;
