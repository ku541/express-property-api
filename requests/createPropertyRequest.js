import { body } from 'express-validator';

const createPropertyRequest = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required.')
        .isString()
        .withMessage('Title must be a string.'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required.')
        .isString()
        .withMessage('Description must be a string.'),
    body('type')
        .trim()
        .notEmpty()
        .withMessage('Type is required.')
        .isString()
        .withMessage('Type must be a string.'),
    body('location')
        .trim()
        .notEmpty()
        .withMessage('Location is required.')
        .isString()
        .withMessage('Location must be a string.'),
    body('price')
        .trim()
        .notEmpty()
        .withMessage('Price is required.')
        .isString()
        .withMessage('Price must be a string.')
        .isNumeric()
        .withMessage('Price must be numeric.')
];

export default createPropertyRequest;