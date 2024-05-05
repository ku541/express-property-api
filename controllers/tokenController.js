import * as jose from 'jose';
import { StatusCodes } from 'http-status-codes';
import { matchedData } from 'express-validator';

import User from '../mongodb/models/user.js';
import { respondIfInvalidRequest } from '../helpers/validation.js';

const createToken = async (req, res) => {
    try {
        respondIfInvalidRequest(req, res);

        const validated = matchedData(req);

        const user = await User.findOne({ email: validated.email });

        if (Number(validated.otp) !== user.otp.code) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid OTP' });
        }

        delete user.otp;

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);

        const token = await new jose.SignJWT({ user })
            .setProtectedHeader({ alg: process.env.JWT_ALGORITHM })
            .setIssuedAt()
            .setExpirationTime(process.env.JWT_EXPIRATION)
            .sign(secret);

        res.status(StatusCodes.CREATED).json({ token });
    } catch (error) {
        console.error(error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
}

export { createToken };