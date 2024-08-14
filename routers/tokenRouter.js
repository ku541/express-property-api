import { Router } from 'express';

import createTokenRequest from '../requests/createTokenRequest.js';
import createToken from '../controllers/tokenController.js';

const router = Router();

router.post('/', createTokenRequest, createToken);

export default router;