
import { body } from "express-validator";

const createCourseValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Course title is required")
    .isString()
    .withMessage("Course title must be a string"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Course description is required")
    .isString()
    .withMessage("Course description must be a string"),

  body("price")
    .notEmpty()
    .withMessage("Course price is required")
    .isDecimal({ decimal_digits: "0,2" })
    .withMessage("Course price must be a valid non-negative decimal")
    .custom((value) => {
      if (Number(value) < 0) {
        throw new Error("Course price cannot be negative");
      }

      return true;
    }),

  body("image")
    .optional({ nullable: true })
    .isString()
    .withMessage("Course image must be a string"),

  body("categoryIds")
    .optional()
    .isArray()
    .withMessage("Category IDs must be an array"),

  body("categoryIds.*")
    .optional()
    .isUUID()
    .withMessage("Each category ID must be a valid UUID"),
];

export { createCourseValidator };
