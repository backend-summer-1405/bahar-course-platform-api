
import { Router } from "express";
import { checkAuthentication, optionalAuthentication } from "../middleware/checkAuthentication.middleware.js";
import { checkAuthorization } from "../middleware/checkAuthorization.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createCourseValidator, updateCourseValidator } from "../validator/course.validator.js";
import { createCourse } from "../controllers/courses/create-course.controller.js";
import { uploadImageMiddleware } from "../middleware/upload-image.middleware.js";
import { updateCourse } from "../controllers/courses/update-course.controller.js";
import { deleteCourse } from "../controllers/courses/delete-course.controller.js";
import { getCourses } from "../controllers/courses/get-courses.controller.js";
import { ratingValidator } from "../validator/rating.validator.js";
import { rateCourse } from "../controllers/rating/rate-course.controller.js";
import { reactToCourse } from "../controllers/reactions/reaction-course.controller.js";
import { commentValidator } from "../validator/comment.validator.js";
import { createComment } from "../controllers/courses/comment/createComment.js";
import { getComments } from "../controllers/courses/comment/get-comments.controller.js";
import { getCourseDetails } from "../controllers/courses/get-course-details.controller.js";
import { updateComment } from "../controllers/courses/comment/update-comment.controller.js";
import { deleteComment } from "../controllers/courses/comment/delete-comment.controller.js";
import { createReservation, getMyReservations } from "../controllers/reservations/reservation.controller.js";

const courseRouter = Router();
courseRouter.get(
  "/",
  optionalAuthentication,
  getCourses,
);

courseRouter.get(
  "/:courseId",
  optionalAuthentication,
  getCourseDetails,
);

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

// reaction route
courseRouter.put(
  "/:courseId/reaction",
  checkAuthentication,
  reactToCourse,
);

// comments route
courseRouter.post(
  "/:courseId/comments",
  checkAuthentication,
  commentValidator,
  validate,
  createComment,
);

courseRouter.get(
  "/:courseId/comments",
  optionalAuthentication,
  getComments,
);
courseRouter.patch(
  "/:courseId/comments/:commentId",
  checkAuthentication,
  commentValidator,
  validate,
  updateComment,
);

courseRouter.delete(
  "/:courseId/comments/:commentId",
  checkAuthentication,
  deleteComment,
);


export { courseRouter };
