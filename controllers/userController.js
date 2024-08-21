import { StatusCodes } from 'http-status-codes';
import { MongoServerError } from 'mongodb';
import { matchedData } from 'express-validator';

import respondIfInvalidRequest from '../helpers/validation.js';
import User from '../mongodb/models/user.js';
import {
    optimize,
    configureCloudinary,
    uploadAndCleanUp,
    destroy
} from '../helpers/image.js';

const DUPLICATE_KEY_ERROR_CODE = 11000;
const AVATAR_WIDTH = 256;

const createUser = async (req, res) => {
    try {
        if (respondIfInvalidRequest(req, res)) return;

        const user = await User.create(matchedData(req));

        res.status(StatusCodes.CREATED).json(user);
    } catch (error) {
        console.error(error);

        if (
            error instanceof MongoServerError &&
            error.code === DUPLICATE_KEY_ERROR_CODE
        ) {
            return res.status(StatusCodes.CONFLICT).send({
                error: 'Email must be unique.'
            });
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        if (respondIfInvalidRequest(req, res)) return;

        const { name, email } = req.body;

        if (req.file) {
            const optimizedAvatarPath = await optimize(req, AVATAR_WIDTH);

            configureCloudinary();

            const avatar = await uploadAndCleanUp(optimizedAvatarPath, 'avatars', req);

            if (req.user.avatar) {
                await destroy(req.user.avatar);
            }

            await req.user.set({ name, email, avatar }).save();
        } else {
            await req.user.set({ name, email }).save();
        }

        return res.status(StatusCodes.OK).send(req.user);
    } catch (error) {
        console.error(error);

        if (
            error instanceof MongoServerError &&
            error.code === DUPLICATE_KEY_ERROR_CODE
        ) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                error: 'Email must be unique.'
            });
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            error: 'An error occurred while creating the user.'
        });
    }
};

export {
    createUser,
    updateUser
};
