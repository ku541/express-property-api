import { body } from 'express-validator';

const validateEmailChain = () => body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isString()
    .withMessage('Email must be a string.')
    .isEmail()
    .withMessage('Email must be a valid email address.')
    .normalizeEmail();

const userRegistrationRequest = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required.')
        .isString()
        .withMessage('Name must be a string.')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters.'),
    validateEmailChain()
];

export {
    userRegistrationRequest,
    validateEmailChain
};