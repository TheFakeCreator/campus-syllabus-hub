import { Router } from 'express';
import { authenticateToken, requireRole } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import {
    getDashboardStats,
    getAllUsers,
    updateUserRole,
    deleteUser,
    getAllResourcesAdmin,
    approveResource,
    deleteResourceAdmin,
    getAllSubjectsAdmin,
    createSubject,
    updateSubject,
    deleteSubject,
    getAllBranchesAdmin,
    createBranch,
    updateBranch,
    deleteBranch,
    getAllRoadmapsAdmin,
    updateRoadmapAdmin,
    approveRoadmap,
    deleteRoadmapAdmin
} from './admin.controller.js';
import {
    updateUserRoleSchema,
    paginationQuerySchema,
    approveResourceSchema,
    createSubjectSchema,
    updateSubjectSchema,
    createBranchSchema,
    updateBranchSchema
} from './admin.schemas.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireRole('admin'));

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// User Management
router.get('/users', getAllUsers);
router.patch('/users/:userId/role', validate(updateUserRoleSchema), updateUserRole);
router.delete('/users/:userId', deleteUser);

// Resource Management
router.get('/resources', getAllResourcesAdmin);
router.patch('/resources/:resourceId/approve', validate(approveResourceSchema), approveResource);
router.delete('/resources/:resourceId', deleteResourceAdmin);

// Subject Management
router.get('/subjects', getAllSubjectsAdmin);
router.post('/subjects', validate(createSubjectSchema), createSubject);
router.patch('/subjects/:subjectId', validate(updateSubjectSchema), updateSubject);
router.delete('/subjects/:subjectId', deleteSubject);

// Branch Management
router.get('/branches', getAllBranchesAdmin);
router.post('/branches', validate(createBranchSchema), createBranch);
router.patch('/branches/:branchId', validate(updateBranchSchema), updateBranch);
router.delete('/branches/:branchId', deleteBranch);

// Roadmap Management
router.get('/roadmaps', getAllRoadmapsAdmin);
router.patch('/roadmaps/:roadmapId', updateRoadmapAdmin);
router.patch('/roadmaps/:roadmapId/approve', validate(approveResourceSchema), approveRoadmap);
router.delete('/roadmaps/:roadmapId', deleteRoadmapAdmin);

export default router;
