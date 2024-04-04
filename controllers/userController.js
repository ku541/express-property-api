import { StatusCodes } from 'http-status-codes';
import { MongoServerError } from 'mongodb';
import { validationResult, matchedData } from 'express-validator';

import User from '../mongodb/models/user.js';
import nodemailer from '../mail/nodemailer.js';

const DUPLICATE_KEY_ERROR_CODE = 11000;

const getAllUsers = async (req, res) => {};
const findUser = async (req, res) => {};

// todo: implement input validation
const createUser = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty) {
            res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
        }

        const { name, email } = matchedData(req);

        // idea: remove below & do new User(...) & user.generateOTP().save()
        const otp = new User().generateOTP();

        const user = await User.create({ name, email, otp});

        nodemailer.sendMail({
            from: `${process.env.MAIL_FROM_NAME} ${process.env.MAIL_FROM_ADDRESS}`,
            to: `${user.name} ${user.email}`,
            // todo: add [MAIL_FROM_NAME] to subject
            // todo: add expires in to subject
            subject: 'Login OTP',
            text: `${otp.code}`
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
