const { MulterError } = require("multer");
const { StatusCodes } = require("http-status-codes");

const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof MulterError) {
    return res.status(StatusCodes.BAD_REQUEST).send(err);
  } else if (err instanceof Error) {
    return res.status(StatusCodes.BAD_REQUEST).send({ error: err.message });
  }

  next();
};

module.exports = handleMulterErrors;
