import { Router } from "express";
import { validate } from "../middleware/validate.middleware.js";
import { registerValidator } from "../validator/auth.validator.js";
import { register } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerValidator, validate, register);

export { authRouter};