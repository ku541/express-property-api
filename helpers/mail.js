const nodemailer = require("../mail/nodemailer.js");

const { OTP_VALIDITY_IN_MINUTES } = require("../mongodb/models/user.js");

const sendOTPMail = async (user) =>
  await nodemailer.sendMail({
    from: `${process.env.MAIL_FROM_NAME} ${process.env.MAIL_FROM_ADDRESS}`,
    to: `${user.name} ${user.email}`,
    subject: `Your login code is ${user.otp.code}`,
    text: `Your login code is ${user.otp.code}. It expires in ${OTP_VALIDITY_IN_MINUTES} minutes.`,
  });

module.exports = sendOTPMail;
