import { param } from 'express-validator';

const findPropertyRequest = [
    param('id')
        .trim()
        .notEmpty()
        .withMessage('Property id is required.')
        .isMongoId()
        .withMessage('Property id must be a valid MongoDB ObjectId')
];

export default findPropertyRequest;