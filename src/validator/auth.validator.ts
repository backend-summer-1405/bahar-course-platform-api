
import { body } from "express-validator";

const registerValidator = [
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

export { registerValidator };
