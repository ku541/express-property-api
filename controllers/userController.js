import { MongoServerError } from 'mongodb';
import { StatusCodes } from 'http-status-codes';
import { matchedData } from 'express-validator';

import User from '../mongodb/models/user.js';
import { respondIfInvalid } from '../helpers/validation.js';

const DUPLICATE_KEY_ERROR_CODE = 11000;

const getAllUsers = async (req, res) => {};
const findUser = async (req, res) => {};

const createUser = async (req, res) => {
    try {
        respondIfInvalid(req, res);

        const user = await User.create(matchedData(req));

        res.status(StatusCodes.CREATED).json(user);
    } catch (error) {
        console.error(error);

        if (error instanceof MongoServerError && error.code === DUPLICATE_KEY_ERROR_CODE) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                error: 'Email must be unique'
            });
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
};

export {
    getAllUsers,
    createUser,
    findUser
};
