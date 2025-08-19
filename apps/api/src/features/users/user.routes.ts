import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.js';
import { getProfile, updateProfile, getUserResources, getUserStats } from './user.controller.js';

const router = Router();

// All user routes require authentication
router.use(authenticateToken);

router.get('/me', getProfile);
router.patch('/me', updateProfile);
router.get('/me/resources', getUserResources);
router.get('/me/stats', getUserStats);

export default router;
