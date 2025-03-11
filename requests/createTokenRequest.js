const { body } = require("express-validator");

const { validateEmailChain } = require("./createUserRequest.js");
const { MIN_OTP, MAX_OTP } = require("../mongodb/models/user.js");

const createTokenRequest = [
  validateEmailChain(),
  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP is required.")
    .isString()
    .withMessage("OTP must be a string.")
    .isInt({ min: MIN_OTP, max: MAX_OTP })
    .withMessage(`OTP must be an integer between ${MIN_OTP} & ${MAX_OTP}`),
];

module.exports = createTokenRequest;
