import { body } from "express-validator";

export const ratingValidator = [
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),
];