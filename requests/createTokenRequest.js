import { body } from 'express-validator';

import { validateEmailChain } from './createUserRequest.js';
import { MIN_OTP } from '../mongodb/models/user.js';
import { MAX_OTP } from '../mongodb/models/user.js';

const createTokenRequest = [
    validateEmailChain(),
    body('otp')
        .trim()
        .notEmpty()
        .withMessage('OTP is required.')
        .isString()
        .withMessage('OTP must be a string.')
        .isInt({ min: MIN_OTP, max: MAX_OTP })
        .withMessage(`OTP must be an integer between ${MIN_OTP} & ${MAX_OTP}`)
];

export default createTokenRequest;