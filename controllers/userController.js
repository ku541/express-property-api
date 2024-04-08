import { StatusCodes } from 'http-status-codes';
import { MongoServerError } from 'mongodb';
import { validationResult, matchedData } from 'express-validator';

import User, { OTP_VALIDITY_IN_MINUTES } from '../mongodb/models/user.js';
import nodemailer from '../mail/nodemailer.js';

const DUPLICATE_KEY_ERROR_CODE = 11000;

const getAllUsers = async (req, res) => {};
const findUser = async (req, res) => {};

const createUser = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty) {
            res.status(StatusCodes.BAD_REQUEST)
                .json({ errors: errors.array() });
        }

        const user = new User(matchedData(req));

        await user.generateOTP().save();

        nodemailer.sendMail({
            from: `${process.env.MAIL_FROM_NAME} ${process.env.MAIL_FROM_ADDRESS}`,
            to: `${user.name} ${user.email}`,
            subject: `Your login code is ${user.otp.code}`,
            text: `Your login code is ${user.otp.code}. It expires in ${OTP_VALIDITY_IN_MINUTES} minutes.`
        });

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
