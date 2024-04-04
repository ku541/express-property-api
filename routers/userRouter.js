import { Router } from 'express';

import { 
    getAllUsers,
    createUser,
    findUser
} from '../controllers/userController.js';
import { userRegistrationRequest } from '../requests/userRegistrationRequest.js';

const router = Router();

router.get('/', getAllUsers);
router.post('/', userRegistrationRequest, createUser);
router.get('/:id', findUser);

export default router;