import { Router } from "express";
import { getTeachers } from "../controllers/teachers/get-teachers.controller.js";
import { getTeacherDetails } from "../controllers/teachers/get-teacher-details.controller.js";

const teachersRouter = Router();

teachersRouter.get("/:teacherId", getTeacherDetails);
teachersRouter.get("/", getTeachers);

export { teachersRouter };
