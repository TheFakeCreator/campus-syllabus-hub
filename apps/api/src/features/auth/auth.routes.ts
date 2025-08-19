import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { authenticateToken } from '../../middleware/auth.js';
import { registerSchema, loginSchema, refreshSchema, logoutSchema } from './auth.schemas.js';
import { register, login, refresh, logout, me } from './auth.controller.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', validate(refreshSchema), refresh);
router.post('/logout', validate(logoutSchema), logout);
router.get('/me', authenticateToken, me);

export default router;
