import { Router } from 'express';
import { authenticateToken, requireRole } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import {
    getAllRatings,
    getResourceRatings,
    createOrUpdateRating,
    deleteRating,
    voteHelpful
} from './rating.controller.js';
import { ratingSchema } from '../roadmaps/roadmap.schemas.js';

const router = Router();

// Public routes
router.get('/', getAllRatings);
router.get('/resource/:resourceId', getResourceRatings);

// Protected routes
router.post('/resource/:resourceId',
    authenticateToken,
    validate(ratingSchema),
    createOrUpdateRating
);

router.delete('/resource/:resourceId/:ratingId',
    authenticateToken,
    deleteRating
);

router.post('/:ratingId/helpful',
    authenticateToken,
    voteHelpful
);

export default router;
