import { body } from 'express-validator';

const updateUserRequest = [
    body('name')
        .optional()
        .trim()
        .isString()
        .withMessage('Name must be a string.'),
    body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Email must be a valid email address.')
        .normalizeEmail()
];

export default updateUserRequest;