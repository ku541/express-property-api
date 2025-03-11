const { validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");

const respondIfInvalidRequest = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });

    return true;
  }

  return false;
};

module.exports = respondIfInvalidRequest;
