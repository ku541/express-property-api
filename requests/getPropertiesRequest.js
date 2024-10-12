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
        .withMessage(`Limit must be between ${MIN_LIMIT} & ${MAX_LIMIT}`)
        .toInt(),
    query('type')
        .trim()
        .optional()
        .isAlphanumeric(process.env.APP_LOCALE, { ignore: ' ' })
        .withMessage('Type must contain only letters, numbers & spaces.'),
    query('title')
        .trim()
        .optional()
        .isAlphanumeric(process.env.APP_LOCALE, { ignore: ' ' })
        .withMessage('Type must contain only letters, numbers & spaces.'),
    query('sort')
        .trim()
        .optional()
        .isIn(['price', 'createdAt', 'updatedAt'])
        .withMessage('Sort must be price, createdAt or updatedAt.'),
    query('order')
        .trim()
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Order must be asc or desc.')
];

export default getPropertiesRequest;