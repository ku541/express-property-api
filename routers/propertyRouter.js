import { Router } from 'express';

import {
    getProperties,
    findProperty,
    createProperty,
    updateProperty,
    deleteProperty
} from '../controllers/propertyController.js';
import authentication from '../middlewares/authentication.js';
import { upload } from '../helpers/image.js';
import handleMulterErrors from '../middlewares/handleMulterErrors.js';
import createPropertyRequest from '../requests/createPropertyRequest.js';
import getPropertiesRequest from '../requests/getPropertiesRequest.js';
import findPropertyRequest from '../requests/findPropertyRequest.js';
import checkPropertyOwnership from '../middlewares/checkPropertyOwnership.js';
import updatePropertyRequest from '../requests/updatePropertyRequest.js';

const router = Router();

router.get('/', [
    authentication,
    getPropertiesRequest
], getProperties);
router.get('/:id', [
    authentication,
    findPropertyRequest
], findProperty);
router.post('/', [
    authentication,
    upload.single('image'),
    handleMulterErrors,
    createPropertyRequest
], createProperty);
router.patch('/:id', [
    authentication,
    upload.single('image'),
    handleMulterErrors,
    updatePropertyRequest,
    checkPropertyOwnership
], updateProperty);
router.delete('/:id', [
    authentication,
    findPropertyRequest,
    checkPropertyOwnership
], deleteProperty);

export default router;