import { StatusCodes } from 'http-status-codes';
import { matchedData } from 'express-validator';

import User from '../mongodb/models/user.js';
import { respondIfInvalidRequest } from '../helpers/validation.js';
import { sendOTPMail } from '../helpers/mail.js';

const createOTP = async (req, res) => {
    try {
        respondIfInvalidRequest(req, res);

        const user = await User.findOne(matchedData(req));

        await user.generateOTP().save();

        await sendOTPMail(user);

        res.status(StatusCodes.CREATED).json({ message: 'Sent the OTP to your email.' });
    } catch (error) {
        console.error(error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
}

export { createOTP };