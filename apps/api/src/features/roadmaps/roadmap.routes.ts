import { Router } from 'express';
import { authenticateToken, requireRole } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import {
    getAllRoadmaps,
    getRoadmapsBySubject,
    getRoadmapById,
    createRoadmap,
    updateRoadmap,
    deleteRoadmap
} from './roadmap.controller.js';
import { createRoadmapSchema, updateRoadmapSchema } from './roadmap.schemas.js';

const router = Router();

// Public routes
router.get('/', getAllRoadmaps);
router.get('/subject/:subjectCode', getRoadmapsBySubject);
router.get('/:id', getRoadmapById);

// Protected routes
router.post('/',
    authenticateToken,
    requireRole('moderator', 'admin'),
    validate(createRoadmapSchema),
    createRoadmap
);

router.patch('/:id',
    authenticateToken,
    validate(updateRoadmapSchema),
    updateRoadmap
);

router.delete('/:id',
    authenticateToken,
    deleteRoadmap
);

export default router;
