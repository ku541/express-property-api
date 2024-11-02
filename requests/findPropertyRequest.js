import { param } from 'express-validator';

const validateIdChain = (modelName) => param('id')
    .trim()
    .notEmpty()
    .withMessage(`${modelName} id is required.`)
    .isMongoId()
    .withMessage(`${modelName} id must be a valid MongoDB ObjectId`);

const findPropertyRequest = [
    validateIdChain('Property')
];

export {
    findPropertyRequest as default,
    validateIdChain
};