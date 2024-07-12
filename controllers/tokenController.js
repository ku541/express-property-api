import { SignJWT } from 'jose';
import { StatusCodes } from 'http-status-codes';
import { matchedData } from 'express-validator';

import User from '../mongodb/models/user.js';
import { respondIfInvalidRequest } from '../helpers/validation.js';

const createToken = async (req, res) => {
    try {
        if (respondIfInvalidRequest(req, res)) return;

        const validated = matchedData(req);

        const user = await User.findOne({ email: validated.email });

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND)
                .send({ error: 'User not found.' });
        }

        if (!user.otp || !user.otp.code || !user.otp.expiresAt) {
            return res.status(StatusCodes.NOT_FOUND)
                .send({ error: 'No OTP found. Please request a new OTP.' })
        }

        if (new Date > user.otp.expiresAt) {
            return res.status(StatusCodes.BAD_REQUEST)
                .send({ error: 'OTP has expired. Please request a new OTP.' })
        }

        if (Number(validated.otp) !== user.otp.code) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid OTP' });
        }

        await User.updateOne({ _id: user._id }, { $unset: { otp: 1 } });

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);

        const token = await new SignJWT({ _id: user.id })
            .setProtectedHeader({ alg: process.env.JWT_ALGORITHM })
            .setIssuedAt()
            .setExpirationTime(process.env.JWT_EXPIRATION)
            .sign(secret);

        res.status(StatusCodes.CREATED).json({ token });
    } catch (error) {
        console.error(error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ error: error.message });
    }
}

export { createToken };