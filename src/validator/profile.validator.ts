import { body } from "express-validator";

const updateProfileValidator = [
  body("firstName")
    .optional({ nullable: true })
    .isString()
    .withMessage("First name must be a string"),

  body("lastName")
    .optional({ nullable: true })
    .isString()
    .withMessage("Last name must be a string"),

  body("telegram")
    .optional({ nullable: true })
    .isString()
    .withMessage("Telegram must be a string"),

  body("linkedin")
    .optional({ nullable: true })
    .isString()
    .withMessage("LinkedIn must be a string"),

  body("github")
    .optional({ nullable: true })
    .isString()
    .withMessage("GitHub must be a string"),

  body("bio")
    .optional({ nullable: true })
    .isString()
    .withMessage("Bio must be a string"),

  body("address")
    .optional({ nullable: true })
    .isString()
    .withMessage("Address must be a string"),

  body("birthDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("Birth date must be a valid date"),
];


// Admin validator
const updateUserProfileValidator = [
  body("firstName")
    .optional({ nullable: true })
    .isString()
    .withMessage("First name must be a string"),

  body("lastName")
    .optional({ nullable: true })
    .isString()
    .withMessage("Last name must be a string"),

  body("telegram")
    .optional({ nullable: true })
    .isString()
    .withMessage("Telegram must be a string"),

  body("linkedin")
    .optional({ nullable: true })
    .isString()
    .withMessage("LinkedIn must be a string"),

  body("github")
    .optional({ nullable: true })
    .isString()
    .withMessage("GitHub must be a string"),

  body("bio")
    .optional({ nullable: true })
    .isString()
    .withMessage("Bio must be a string"),

  body("address")
    .optional({ nullable: true })
    .isString()
    .withMessage("Address must be a string"),

  body("birthDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("Birth date must be a valid date"),
];



export { updateProfileValidator ,updateUserProfileValidator};