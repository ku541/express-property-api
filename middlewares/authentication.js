import { jwtVerify } from 'jose';
import { StatusCodes } from 'http-status-codes';

const authentication = async (req, res, next) => {
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);

        const token = req.header('Authorization').replace('Bearer ', '');

        await jwtVerify(token, secret);

        next();
    } catch (error) {
        console.error(error);

        res.status(StatusCodes.UNAUTHORIZED).send({ error: error });
    }
};

export default authentication;