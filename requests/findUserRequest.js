import { param } from 'express-validator';

import { validateIdChain } from './findPropertyRequest.js';

const findUserRequest = [
    validateIdChain('User')
];

export default findUserRequest;