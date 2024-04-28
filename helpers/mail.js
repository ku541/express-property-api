import nodemailer from '../mail/nodemailer.js';

import { OTP_VALIDITY_IN_MINUTES } from '../mongodb/models/user.js';

const sendOTPMail = async (user) => {
    return nodemailer.sendMail({
        from: `${process.env.MAIL_FROM_NAME} ${process.env.MAIL_FROM_ADDRESS}`,
        to: `${user.name} ${user.email}`,
        subject: `Your login code is ${user.otp.code}`,
        text: `Your login code is ${user.otp.code}. It expires in ${OTP_VALIDITY_IN_MINUTES} minutes.`
    });
}

export {
    sendOTPMail
};