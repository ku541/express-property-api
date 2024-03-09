import { Router } from 'express';

import { 
    getAllUsers,
    createUser,
    findUser
} from '../controllers/userController.js';

const router = Router();

router.get('/', getAllUsers);
router.post('/', createUser);
router.get('/:id', findUser);

export default router;