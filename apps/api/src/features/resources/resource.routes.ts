import { Router } from 'express';
import { authenticateToken, requireRole } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createResourceSchema, updateResourceSchema } from './resource.schemas.js';
import {
    getResources,
    getResourceById,
    createResource,
    updateResource,
    deleteResource,
    approveResource
} from './resource.controller.js';

const router = Router();

// Public routes
router.get('/', getResources);
router.get('/:id', getResourceById);

// Protected routes - require authentication
router.post('/', authenticateToken, validate(createResourceSchema), createResource);
router.put('/:id', authenticateToken, validate(updateResourceSchema), updateResource);
router.delete('/:id', authenticateToken, deleteResource);

// Admin/Moderator only routes
router.patch('/:id/approve', authenticateToken, requireRole('admin', 'moderator'), approveResource);

export default router;
