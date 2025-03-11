const { jwtVerify } = require("jose");
const { JWTExpired } = require("jose/errors");
const { StatusCodes } = require("http-status-codes");

const { User } = require("../mongodb/models/user.js");

const authentication = async (req, res, next) => {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = req.header("Authorization").replace("Bearer ", "");

    const { payload } = await jwtVerify(token, secret);

    req.user = await User.findById(payload._id);

    next();
  } catch (error) {
    console.error(error);

    if (error instanceof JWTExpired) {
      return res.status(StatusCodes.UNAUTHORIZED).send({
        error: "Token has expired. Please request a new token.",
      });
    }

    res.status(StatusCodes.UNAUTHORIZED).send({ error: error.message });
  }
};

module.exports = authentication;
