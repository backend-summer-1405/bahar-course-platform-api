import { body } from "express-validator";

const registerValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email"),
];

const verifyEmailValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("code")
    .trim()
    .notEmpty()
    .withMessage("Verification code is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("Verification code must be 6 digits")
    .isNumeric()
    .withMessage("Verification code must contain only numbers"),
];
const setPasswordValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 30 })
    .withMessage("Password must be between 8 and 30 characters"),
];

export { registerValidator, verifyEmailValidator,setPasswordValidator };