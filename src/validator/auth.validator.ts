import { body } from "express-validator";

// Shared validators
const emailValidator = body("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Please enter a valid email");

const verificationCodeValidator = body("code")
  .trim()
  .notEmpty()
  .withMessage("Verification code is required")
  .isLength({ min: 6, max: 6 })
  .withMessage("Verification code must be 6 digits")
  .isNumeric()
  .withMessage("Verification code must contain only numbers");

const passwordValidator = body("password")
  .notEmpty()
  .withMessage("Password is required")
  .isLength({ min: 8, max: 30 })
  .withMessage("Password must be between 8 and 30 characters");

// Register validator
const registerValidator = [emailValidator];

// Verify email validators
const verifyEmailValidator = [emailValidator, verificationCodeValidator];

// Set password validators
const setPasswordValidator = [emailValidator, passwordValidator];

// Login validator
const loginValidator = [emailValidator, passwordValidator];

// Forgot password validator
const forgotPasswordValidator = [emailValidator];

// Verify reset code validators
const verifyResetCodeValidator = [emailValidator, verificationCodeValidator];

// Reset password validator
const resetPasswordValidator = [
  emailValidator,
  verificationCodeValidator,
  passwordValidator,
];

export {
  registerValidator,
  verifyEmailValidator,
  setPasswordValidator,
  loginValidator,
  forgotPasswordValidator,
  verifyResetCodeValidator,
  resetPasswordValidator,
};
