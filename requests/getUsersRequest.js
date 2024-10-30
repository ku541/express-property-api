import { query } from 'express-validator';

import {
    validatePageChain,
    validateLimitChain,
    validateOrderChain
} from './getPropertiesRequest.js';

const SORTABLE_COLUMNS = ['createdAt', 'updatedAt'];

const getUsersRequest = [
    validatePageChain(),
    validateLimitChain(),
    query('name')
        .trim()
        .optional()
        .isString()
        .withMessage('Name must be a string.')
        .isAlpha(process.env.APP_LOCALE, { ignore: ' ' })
        .withMessage('Name must contain only letters & spaces.'),
    query('email')
        .trim()
        .optional()
        .isString()
        .withMessage('Email must be a string.')
        .isEmail()
        .withMessage('Email must be a valid email address.')
        .normalizeEmail(),
    query('sort')
        .trim()
        .optional()
        .isIn(['createdAt', 'updatedAt'])
        .withMessage('Sort must be createdAt or updatedAt.'),
    validateOrderChain()
];

export default getUsersRequest;