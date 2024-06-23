import { jwtVerify } from 'jose';
import { StatusCodes } from 'http-status-codes';

import User from '../mongodb/models/user.js';

const authentication = async (req, res, next) => {
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);

        const token = req.header('Authorization').replace('Bearer ', '');

        const { payload } = await jwtVerify(token, secret);

        req.user = await User.findById(payload._id);

        next();
    } catch (error) {
        console.error(error);

        res.status(StatusCodes.UNAUTHORIZED).send({ error: error });
    }
};

export default authentication;
