import { Router } from 'express';
import multer from 'multer';

import {
    createUser,
    updateUser
} from '../controllers/userController.js';
import { userRegistrationRequest } from '../requests/userRegistrationRequest.js';
import authentication from '../middlewares/authentication.js';
import userUpdateRequest from '../requests/userUpdateRequest.js';
import handleMulterErrors from '../middlewares/handleMulterErrors.js';

const router = Router();

const ALLOWED_MIME_TYPES = ['image/webp', 'image/jpeg', 'image/png'];
const ALLOWED_FILE_SIZE_IN_MB = 5;

const upload = multer({
    dest: process.env.MULTER_UPLOAD_PATH,
    fileFilter: (req, file, cb) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            cb(new Error('Only a jpeg or a png is allowed.'));
        }

        cb(null, true);
    },
    limits: { fileSize: ALLOWED_FILE_SIZE_IN_MB * 1024 * 1024 }
});

router.post('/', userRegistrationRequest, createUser);
router.patch('/', [
    authentication,
    upload.single('avatar'),
    handleMulterErrors,
    userUpdateRequest
], updateUser);

export default router;