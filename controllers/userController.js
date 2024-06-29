import { mkdir, unlink } from 'node:fs/promises';

import { MongoServerError } from 'mongodb';
import { StatusCodes } from 'http-status-codes';
import { matchedData } from 'express-validator';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';

import User from '../mongodb/models/user.js';
import { respondIfInvalidRequest } from '../helpers/validation.js';

const DUPLICATE_KEY_ERROR_CODE = 11000;
const AVATAR_WIDTH = 256;

const getAllUsers = async (req, res) => {};
const findUser = async (req, res) => {};

const createUser = async (req, res) => {
    try {
        respondIfInvalidRequest(req, res);

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

const updateUser = async (req, res) => {
    try {
        respondIfInvalidRequest(req, res);

        // todo: test without file
        // todo: replace existing avatar with incoming avatar

        await mkdir(process.env.SHARP_UPLOAD_PATH, { recursive: true });

        const optimizedAvatarPath = `${process.env.SHARP_UPLOAD_PATH}/${req.file.filename}`;

        await sharp(req.file.path)
            .resize(AVATAR_WIDTH)
            .webp()
            .toFile(optimizedAvatarPath);

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD,
            api_key: process.env.CLOUDINARY_KEY,
            api_secret: process.env.CLOUDINARY_SECRET
        });

        const uploaded = await cloudinary.uploader.upload(optimizedAvatarPath, {
            asset_folder: 'avatars'
        });

        await unlink(`${process.env.MULTER_UPLOAD_PATH}/${req.file.filename}`);
        await unlink(optimizedAvatarPath);

        const { name, email } = req.body;
        const avatar = uploaded.secure_url;

        await req.user.set({ name, email, avatar }).save();

        return res.status(StatusCodes.OK).send(req.user);
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
    findUser,
    updateUser
};
