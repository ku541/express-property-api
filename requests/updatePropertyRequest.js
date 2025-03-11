const { body } = require("express-validator");

const updatePropertyRequest = [
  body("title")
    .optional()
    .trim()
    .isString()
    .withMessage("Title must be a string."),
  body("description")
    .optional()
    .trim()
    .isString()
    .withMessage("Description must be a string."),
  body("type")
    .optional()
    .trim()
    .isString()
    .withMessage("Type must be a string."),
  body("location")
    .optional()
    .trim()
    .isString()
    .withMessage("Location must be a string."),
  body("price")
    .optional()
    .trim()
    .isString()
    .withMessage("Price must be a string.")
    .isNumeric()
    .withMessage("Price must be numeric."),
];

module.exports = updatePropertyRequest;
