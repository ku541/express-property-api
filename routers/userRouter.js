import { Router } from 'express';

import {
    createUser,
    updateUser,
    getUsers,
    findUser
} from '../controllers/userController.js';
import createUserRequest from '../requests/createUserRequest.js';
import authentication from '../middlewares/authentication.js';
import { upload } from '../helpers/image.js';
import handleMulterErrors from '../middlewares/handleMulterErrors.js';
import updateUserRequest from '../requests/updateUserRequest.js';
import getUsersRequest from '../requests/getUsersRequest.js';
import findUserRequest from '../requests/findUserRequest.js';

const router = Router();

router.post('/', createUserRequest, createUser);
router.patch('/', [
    authentication,
    upload.single('avatar'),
    handleMulterErrors,
    updateUserRequest
], updateUser);
router.get('/', [
    authentication,
    getUsersRequest
], getUsers);
router.get('/:id', [
    authentication,
    findUserRequest
], findUser);

export default router;