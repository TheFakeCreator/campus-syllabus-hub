import { Router } from 'express';
import { searchResources, searchSubjects, globalSearch } from './search.controller.js';

const router = Router();

// Search endpoints
router.get('/resources', searchResources);
router.get('/subjects', searchSubjects);
router.get('/global', globalSearch);
router.get('/', globalSearch); // Default to global search

export default router;
