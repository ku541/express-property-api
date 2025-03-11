const { matchedData } = require("express-validator");
const { StatusCodes } = require("http-status-codes");

const respondIfInvalidRequest = require("../helpers/validation");
const { User } = require("../mongodb/models/user.js");
const sendOTPMail = require("../helpers/mail");

const createOTP = async (req, res) => {
  try {
    if (respondIfInvalidRequest(req, res)) return;

    const user = await User.findOne(matchedData(req));

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: "User not found." });
    }

    await user.generateOTP().save();

    await sendOTPMail(user);

    res
      .status(StatusCodes.CREATED)
      .json({ message: "Sent the OTP to your email." });
  } catch (error) {
    console.error(error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: error.message });
  }
};

module.exports = createOTP;
