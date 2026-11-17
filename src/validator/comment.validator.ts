
import { body } from "express-validator";

const commentValidator = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Comment content is required")
    .isLength({ max: 2000 })
    .withMessage("Comment cannot exceed 2000 characters"),
];

export { commentValidator };
