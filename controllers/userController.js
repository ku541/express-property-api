import { StatusCodes } from 'http-status-codes';

import User from '../mongodb/models/user.js';

const getAllUsers = async (req, res) => {};
const findUser = async (req, res) => {};
const createUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        const otp = new User().generateOTP();

        const user = await User.create({ name, email, otp});

        res.status(StatusCodes.CREATED).json(user);
    } catch (error) {
        console.error(error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
};

export {
    getAllUsers,
    createUser,
    findUser
};