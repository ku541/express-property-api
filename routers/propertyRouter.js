import { Router } from 'express';

import {
    getAllProperties,
    findProperty,
    createProperty,
    updateProperty,
    deleteProperty
} from '../controllers/propertyController.js';

const router = Router();

router.get('/', getAllProperties);
router.get('/:id', findProperty);
router.post('/', createProperty);
router.patch('/:id', updateProperty);
router.delete('/:id', deleteProperty);

export default router;