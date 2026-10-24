
import { Router } from "express";
import { checkAuthentication } from "../middleware/checkAuthentication.middleware.js";
import { checkAuthorization } from "../middleware/checkAuthorization.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createCourseValidator } from "../validator/course.validator.js";
import { createCourse } from "../controllers/courses/create-course.controller.js";

const courseRouter = Router();

courseRouter.post(
  "/",
  checkAuthentication,
  checkAuthorization("TEACHER", "ADMIN"),
  createCourseValidator,
  validate,
  createCourse,
);

export { courseRouter };
