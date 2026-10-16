import { Router } from "express";

import {
  loginValidator,
  registerValidator,
  setPasswordValidator,
  verifyEmailValidator,
  forgotPasswordValidator,
  verifyResetCodeValidator,
  resetPasswordValidator,
} from "../validator/auth.validator.js";

import { validate } from "../middleware/validate.middleware.js";
import { register } from "../controllers/auth/register/register.controller.js";
import { verifyEmail } from "../controllers/auth/register/verify-email.controller.js";
import { setPassword } from "../controllers/auth/register/set-password.controller.js";
import { login } from "../controllers/auth/login/login.controller.js";
import { forgetPassword } from "../controllers/auth/forget-password/forgot-password.controller.js";
import { resetPassword } from "../controllers/auth/forget-password/reset-password.controller.js";
import { verifyResetCode } from "../controllers/auth/forget-password/verify-reset-code.controller.js";

const authRouter = Router();

// Register
authRouter.post("/register", registerValidator, validate, register);
authRouter.post("/verify-email", verifyEmailValidator, validate, verifyEmail);
authRouter.post("/set-password", setPasswordValidator, validate, setPassword);

// Login
authRouter.post("/login", loginValidator, validate, login);

// Forgot password
authRouter.post("/forget-password", forgotPasswordValidator, validate, forgetPassword);
authRouter.post("/verify-reset-code", verifyResetCodeValidator, validate, verifyResetCode);
authRouter.post("/reset-password", resetPasswordValidator, validate, resetPassword);

export { authRouter };