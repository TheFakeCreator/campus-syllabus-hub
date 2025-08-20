import { Request, Response } from 'express';
import { User } from '../users/user.model.js';
import { Resource } from '../resources/resource.model.js';
import { Subject } from '../catalog/subject.model.js';
import { Branch } from '../catalog/branch.model.js';
import { Roadmap } from '../roadmaps/roadmap.model.js';
import { paginationSchema } from '../../utils/pagination.js';

// Dashboard Statistics
export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const [
            totalUsers,
            totalResources,
            totalSubjects,
            totalRoadmaps,
            pendingResources,
            activeUsers,
            recentUsers,
            recentResources
        ] = await Promise.all([
            User.countDocuments(),
            Resource.countDocuments(),
            Subject.countDocuments(),
            Roadmap.countDocuments(),
            Resource.countDocuments({ isApproved: false }),
            User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
            User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt'),
            Resource.find().sort({ createdAt: -1 }).limit(5).populate('subjectRef', 'code name').populate('addedBy', 'name')
        ]);

        res.json({
            stats: {
                totalUsers,
                totalResources,
                totalSubjects,
                totalRoadmaps,
                pendingResources,
                activeUsers
            },
            recentActivity: {
                users: recentUsers,
                resources: recentResources
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
    }
};

// User Management
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const paginationResult = paginationSchema.safeParse(req.query);
        if (!paginationResult.success) {
            return res.status(400).json({ message: 'Invalid pagination parameters' });
        }

        const { page = 1, limit = 20 } = paginationResult.data;
        const { search, role } = req.query;

        const filter: any = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        if (role) filter.role = role;

        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            User.find(filter)
                .select('-passwordHash')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            User.countDocuments(filter)
        ]);

        res.json({
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!['student', 'moderator', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        ).select('-passwordHash');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User role updated successfully', user });
    } catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({ message: 'Failed to update user role' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        // Prevent self-deletion
        if (userId === req.user?.userId) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Failed to delete user' });
    }
};

// Resource Management
export const getAllResourcesAdmin = async (req: Request, res: Response) => {
    try {
        const paginationResult = paginationSchema.safeParse(req.query);
        if (!paginationResult.success) {
            return res.status(400).json({ message: 'Invalid pagination parameters' });
        }

        const { page = 1, limit = 20 } = paginationResult.data;
        const { search, type, approved } = req.query;

        const filter: any = {};
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        if (type) filter.type = type;
        if (approved !== undefined) filter.isApproved = approved === 'true';

        const skip = (page - 1) * limit;
        const [resources, total] = await Promise.all([
            Resource.find(filter)
                .populate('subjectRef', 'code name')
                .populate('addedBy', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Resource.countDocuments(filter)
        ]);

        res.json({
            resources,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get resources admin error:', error);
        res.status(500).json({ message: 'Failed to fetch resources' });
    }
};

export const approveResource = async (req: Request, res: Response) => {
    try {
        const { resourceId } = req.params;
        const { approved } = req.body;

        const resource = await Resource.findByIdAndUpdate(
            resourceId,
            { isApproved: approved },
            { new: true }
        ).populate('subjectRef', 'code name').populate('addedBy', 'name email');

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        res.json({
            message: `Resource ${approved ? 'approved' : 'rejected'} successfully`,
            resource
        });
    } catch (error) {
        console.error('Approve resource error:', error);
        res.status(500).json({ message: 'Failed to update resource approval' });
    }
};

export const deleteResourceAdmin = async (req: Request, res: Response) => {
    try {
        const { resourceId } = req.params;

        const resource = await Resource.findByIdAndDelete(resourceId);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        res.json({ message: 'Resource deleted successfully' });
    } catch (error) {
        console.error('Delete resource admin error:', error);
        res.status(500).json({ message: 'Failed to delete resource' });
    }
};

// Subject Management
export const getAllSubjectsAdmin = async (req: Request, res: Response) => {
    try {
        const paginationResult = paginationSchema.safeParse(req.query);
        if (!paginationResult.success) {
            return res.status(400).json({ message: 'Invalid pagination parameters' });
        }

        const { page = 1, limit = 20 } = paginationResult.data;
        const { search, branch } = req.query;

        const filter: any = {};
        if (search) {
            filter.$or = [
                { code: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } }
            ];
        }
        if (branch) filter.branchRef = branch;

        const skip = (page - 1) * limit;
        const [subjects, total] = await Promise.all([
            Subject.find(filter)
                .populate('branchRef', 'code name')
                .populate('semesterRef', 'number')
                .sort({ code: 1 })
                .skip(skip)
                .limit(limit),
            Subject.countDocuments(filter)
        ]);

        res.json({
            subjects,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get subjects admin error:', error);
        res.status(500).json({ message: 'Failed to fetch subjects' });
    }
};

export const createSubject = async (req: Request, res: Response) => {
    try {
        const subject = new Subject(req.body);
        await subject.save();

        const populatedSubject = await Subject.findById(subject._id)
            .populate('branchRef', 'code name')
            .populate('semesterRef', 'number');

        res.status(201).json(populatedSubject);
    } catch (error) {
        console.error('Create subject error:', error);
        res.status(400).json({ message: 'Failed to create subject' });
    }
};

export const updateSubject = async (req: Request, res: Response) => {
    try {
        const { subjectId } = req.params;

        const subject = await Subject.findByIdAndUpdate(
            subjectId,
            req.body,
            { new: true }
        ).populate('branchRef', 'code name').populate('semesterRef', 'number');

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        res.json(subject);
    } catch (error) {
        console.error('Update subject error:', error);
        res.status(400).json({ message: 'Failed to update subject' });
    }
};

export const deleteSubject = async (req: Request, res: Response) => {
    try {
        const { subjectId } = req.params;

        // Check if subject has resources
        const resourceCount = await Resource.countDocuments({ subjectRef: subjectId });
        if (resourceCount > 0) {
            return res.status(400).json({
                message: `Cannot delete subject. It has ${resourceCount} associated resources.`
            });
        }

        const subject = await Subject.findByIdAndDelete(subjectId);
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        res.json({ message: 'Subject deleted successfully' });
    } catch (error) {
        console.error('Delete subject error:', error);
        res.status(500).json({ message: 'Failed to delete subject' });
    }
};

// Branch Management
export const getAllBranchesAdmin = async (req: Request, res: Response) => {
    try {
        const branches = await Branch.find().sort({ code: 1 });
        res.json({ branches });
    } catch (error) {
        console.error('Get branches admin error:', error);
        res.status(500).json({ message: 'Failed to fetch branches' });
    }
};

export const createBranch = async (req: Request, res: Response) => {
    try {
        const branch = new Branch(req.body);
        await branch.save();
        res.status(201).json(branch);
    } catch (error) {
        console.error('Create branch error:', error);
        res.status(400).json({ message: 'Failed to create branch' });
    }
};

export const updateBranch = async (req: Request, res: Response) => {
    try {
        const { branchId } = req.params;

        const branch = await Branch.findByIdAndUpdate(
            branchId,
            req.body,
            { new: true }
        );

        if (!branch) {
            return res.status(404).json({ message: 'Branch not found' });
        }

        res.json(branch);
    } catch (error) {
        console.error('Update branch error:', error);
        res.status(400).json({ message: 'Failed to update branch' });
    }
};

export const deleteBranch = async (req: Request, res: Response) => {
    try {
        const { branchId } = req.params;

        // Check if branch has subjects
        const subjectCount = await Subject.countDocuments({ branchRef: branchId });
        if (subjectCount > 0) {
            return res.status(400).json({
                message: `Cannot delete branch. It has ${subjectCount} associated subjects.`
            });
        }

        const branch = await Branch.findByIdAndDelete(branchId);
        if (!branch) {
            return res.status(404).json({ message: 'Branch not found' });
        }

        res.json({ message: 'Branch deleted successfully' });
    } catch (error) {
        console.error('Delete branch error:', error);
        res.status(500).json({ message: 'Failed to delete branch' });
    }
};

// Roadmap Management
export const getAllRoadmapsAdmin = async (req: Request, res: Response) => {
    try {
        const paginationResult = paginationSchema.safeParse(req.query);
        if (!paginationResult.success) {
            return res.status(400).json({ message: 'Invalid pagination parameters' });
        }

        const { page = 1, limit = 20 } = paginationResult.data;
        const { search, type, difficulty } = req.query;

        const filter: any = {};
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        if (type) filter.type = type;
        if (difficulty) filter.difficulty = difficulty;

        const skip = (page - 1) * limit;
        const [roadmaps, total] = await Promise.all([
            Roadmap.find(filter)
                .populate('subjectRef', 'code name')
                .populate('createdBy', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Roadmap.countDocuments(filter)
        ]);

        res.json({
            roadmaps,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get roadmaps admin error:', error);
        res.status(500).json({ message: 'Failed to fetch roadmaps' });
    }
};

export const updateRoadmapAdmin = async (req: Request, res: Response) => {
    try {
        const { roadmapId } = req.params;

        const roadmap = await Roadmap.findByIdAndUpdate(
            roadmapId,
            req.body,
            { new: true }
        ).populate('createdBy', 'name email');

        if (!roadmap) {
            return res.status(404).json({ message: 'Roadmap not found' });
        }

        res.json(roadmap);
    } catch (error) {
        console.error('Update roadmap admin error:', error);
        res.status(400).json({ message: 'Failed to update roadmap' });
    }
};

export const approveRoadmap = async (req: Request, res: Response) => {
    try {
        const { roadmapId } = req.params;
        const { approved } = req.body;

        const roadmap = await Roadmap.findByIdAndUpdate(
            roadmapId,
            { isApproved: approved },
            { new: true }
        ).populate('createdBy', 'name email');

        if (!roadmap) {
            return res.status(404).json({ message: 'Roadmap not found' });
        }

        res.json({
            message: `Roadmap ${approved ? 'approved' : 'rejected'} successfully`,
            roadmap
        });
    } catch (error) {
        console.error('Approve roadmap error:', error);
        res.status(500).json({ message: 'Failed to update roadmap approval status' });
    }
};

export const deleteRoadmapAdmin = async (req: Request, res: Response) => {
    try {
        const { roadmapId } = req.params;

        const roadmap = await Roadmap.findByIdAndDelete(roadmapId);
        if (!roadmap) {
            return res.status(404).json({ message: 'Roadmap not found' });
        }

        res.json({ message: 'Roadmap deleted successfully' });
    } catch (error) {
        console.error('Delete roadmap admin error:', error);
        res.status(500).json({ message: 'Failed to delete roadmap' });
    }
};
