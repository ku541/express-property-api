import { Router } from 'express';

import { createToken } from '../controllers/tokenController.js';
import { createTokenRequest } from '../requests/createTokenRequest.js';

const router = Router();

router.post('/', createTokenRequest, createToken);

export default router;