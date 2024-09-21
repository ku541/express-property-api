import { query } from 'express-validator';

const MIN_PAGE = 1;
const MIN_LIMIT = 10;
const MAX_LIMIT = 20;

const getPropertiesRequest = [
    query('page')
        .trim()
        .optional()
        .isInt({ min: MIN_PAGE })
        .withMessage('Page must be 1 or greater')
        .toInt(),
    query('limit')
        .trim()
        .optional()
        .isInt({ min: MIN_LIMIT, max: MAX_LIMIT })
        .withMessage('Limit must be between ')
        .toInt()
];

export default getPropertiesRequest;