const { matchedData } = require("express-validator");
const { StatusCodes } = require("http-status-codes");

const respondIfInvalidRequest = require("../helpers/validation.js");
const { User } = require("../mongodb/models/user.js");

const createToken = async (req, res) => {
  try {
    if (respondIfInvalidRequest(req, res)) return;

    const validated = matchedData(req);

    const user = await User.findOne({ email: validated.email });

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: "User not found." });
    }

    if (!user.otp || !user.otp.code || !user.otp.expiresAt) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: "No OTP found. Please request a new OTP." });
    }

    if (new Date() > user.otp.expiresAt) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: "OTP has expired. Please request a new OTP." });
    }

    if (Number(validated.otp) !== user.otp.code) {
      return res.status(StatusCodes.BAD_REQUEST).send({ error: "Invalid OTP" });
    }

    await User.updateOne({ _id: user._id }, { $unset: { otp: 1 } });

    const token = await user.generateToken();

    res.status(StatusCodes.CREATED).json({ token });
  } catch (error) {
    console.error(error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: error.message });
  }
};

module.exports = createToken;
