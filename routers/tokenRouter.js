import { Router } from 'express';

import { createToken } from '../controllers/tokenController.js';
import { userLoginRequest } from '../requests/userLoginRequest.js';

const router = Router();

router.post('/', userLoginRequest, createToken);

export default router;