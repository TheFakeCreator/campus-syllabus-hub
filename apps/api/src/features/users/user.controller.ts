import { Request, Response } from 'express';
import { User } from './user.model.js';
import { Resource } from '../resources/resource.model.js';

export const getProfile = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch profile' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const { name } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { name },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update profile' });
    }
};

export const getUserResources = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const { page = 1, limit = 20 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const [resources, total] = await Promise.all([
            Resource.find({ addedBy: req.user.userId })
                .populate('subjectRef', 'code name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Resource.countDocuments({ addedBy: req.user.userId })
        ]);

        res.json({
            resources,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user resources' });
    }
};

export const getUserStats = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const [totalResources, approvedResources, pendingResources] = await Promise.all([
            Resource.countDocuments({ addedBy: req.user.userId }),
            Resource.countDocuments({ addedBy: req.user.userId, isApproved: true }),
            Resource.countDocuments({ addedBy: req.user.userId, isApproved: false })
        ]);

        const stats = {
            totalResources,
            approvedResources,
            pendingResources,
            approvalRate: totalResources > 0 ? Math.round((approvedResources / totalResources) * 100) : 0
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user stats' });
    }
};
