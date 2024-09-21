import { body } from 'express-validator';

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 50;

const validateEmailChain = () => body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isString()
    .withMessage('Email must be a string.')
    .isEmail()
    .withMessage('Email must be a valid email address.')
    .normalizeEmail();

const createUserRequest = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required.')
        .isString()
        .withMessage('Name must be a string.')
        .isLength({ min: MIN_NAME_LENGTH, max: MAX_NAME_LENGTH })
        .withMessage(`Name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters.`),
    validateEmailChain()
];

export {
    createUserRequest as default,
    validateEmailChain
};