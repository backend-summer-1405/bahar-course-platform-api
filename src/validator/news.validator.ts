
import { body } from "express-validator";

const createNewsValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required"),
];

const updateNewsValidator = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),

  body("content")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Content cannot be empty"),
];

export { createNewsValidator, updateNewsValidator };
