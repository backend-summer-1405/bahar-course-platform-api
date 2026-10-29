
import { Router } from "express";
import { checkAuthentication } from "../middleware/checkAuthentication.middleware.js";
import { checkAuthorization } from "../middleware/checkAuthorization.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createCourseValidator, updateCourseValidator } from "../validator/course.validator.js";
import { createCourse } from "../controllers/courses/create-course.controller.js";
import { uploadImageMiddleware } from "../middleware/upload-image.middleware.js";
import { updateCourse } from "../controllers/courses/update-course.controller.js";
import { deleteCourse } from "../controllers/courses/delete-course.controller.js";
import { getCourses } from "../controllers/courses/get-courses.controller.js";
import { ratingValidator } from "../validator/rating.validator.js";
import { rateCourse } from "../controllers/rating/rate.controller.js";

const courseRouter = Router();

courseRouter.get("/", getCourses);

courseRouter.post(
  "/",
  checkAuthentication,
  checkAuthorization("TEACHER", "ADMIN"),
  uploadImageMiddleware.single("image"),
  createCourseValidator,
  validate,
  createCourse,
);
courseRouter.patch(
  "/:courseId",
  checkAuthentication,
  checkAuthorization("TEACHER", "ADMIN"),
  uploadImageMiddleware.single("image"),
  updateCourseValidator,
  validate,
  updateCourse,
);
courseRouter.delete(
  "/:courseId",
  checkAuthentication,
  checkAuthorization("TEACHER", "ADMIN"),
  deleteCourse,
);

// rate route
courseRouter.put(
  "/:courseId/rating",
  checkAuthentication,
  ratingValidator,
  validate,
  rateCourse,
);
export { courseRouter };
