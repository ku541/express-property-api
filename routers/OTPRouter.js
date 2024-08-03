import { Router } from 'express';

import { validateEmailChain } from '../requests/createUserRequest.js';
import { createOTP } from '../controllers/OTPController.js';

const router = Router();

router.post('/', validateEmailChain(), createOTP);

export default router;