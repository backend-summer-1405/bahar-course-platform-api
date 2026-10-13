import { Router } from "express";
import {
  registerValidator,
  setPasswordValidator,
  verifyEmailValidator,
} from "../validator/auth.validator.js";
import { validate } from "../middleware/validate.middleware.js";
import { register } from "../controllers/auth/register/register.controller.js";
import { verifyEmail } from "../controllers/auth/register/verify-email.controller.js";
import { setPassword } from "../controllers/auth/register/set-password.controller.js";

const authRouter = Router();

authRouter.post("/register", registerValidator, validate, register);
authRouter.post("/verify-email", verifyEmailValidator, validate, verifyEmail);
authRouter.post("/set-password", setPasswordValidator, validate, setPassword);

export { authRouter };
