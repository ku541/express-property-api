import { body } from 'express-validator';

export const userRegistrationRequest = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required.')
        .isString()
        .withMessage('Name must be a string.'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required.')
        .isString()
        .withMessage('Email must be a string.')
        .isEmail()
        .withMessage('Email must be a valid email address.')
        .normalizeEmail()
];