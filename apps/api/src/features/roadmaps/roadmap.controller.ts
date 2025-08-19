import { Request, Response } from 'express';
import { Roadmap } from './roadmap.model.js';
import { Subject } from '../catalog/subject.model.js';
import { paginationSchema } from '../../utils/pagination.js';

// Get all public roadmaps with pagination and filtering
export const getAllRoadmaps = async (req: Request, res: Response) => {
    try {
        const { branch, type, difficulty, page = 1, limit = 20 } = req.query;

        // Build filter
        const filter: any = { isPublic: true };

        if (type && ['midsem', 'endsem', 'practical', 'general'].includes(type as string)) {
            filter.type = type;
        }

        if (difficulty && ['beginner', 'intermediate', 'advanced'].includes(difficulty as string)) {
            filter.difficulty = difficulty;
        }

        // If branch filter is provided, we need to find subjects from that branch
        if (branch) {
            const subjects = await Subject.find({ 'branchRef.code': branch });
            if (subjects.length > 0) {
                filter.subjectRef = { $in: subjects.map(s => s._id) };
            } else {
                // No subjects found for this branch, return empty result
                return res.json({
                    roadmaps: [],
                    total: 0,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: 0
                });
            }
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [roadmaps, total] = await Promise.all([
            Roadmap.find(filter)
                .populate('subjectRef', 'code name branchRef')
                .populate('createdBy', 'name')
                .populate('steps.resources', 'title type provider averageRating totalRatings')
                .sort({ type: 1, difficulty: 1, createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Roadmap.countDocuments(filter)
        ]);

        res.json({
            roadmaps,
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit))
        });
    } catch (error) {
        console.error('Failed to fetch roadmaps:', error);
        res.status(500).json({ message: 'Failed to fetch roadmaps' });
    }
};

// Get roadmaps for a subject
export const getRoadmapsBySubject = async (req: Request, res: Response) => {
    try {
        const { subjectCode } = req.params;
        const { type, difficulty } = req.query;

        // Find subject by code
        const subject = await Subject.findOne({ code: subjectCode });
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        // Build filter
        const filter: any = {
            subjectRef: subject._id,
            isPublic: true
        };

        if (type && ['midsem', 'endsem', 'practical', 'general'].includes(type as string)) {
            filter.type = type;
        }

        if (difficulty && ['beginner', 'intermediate', 'advanced'].includes(difficulty as string)) {
            filter.difficulty = difficulty;
        }

        const roadmaps = await Roadmap.find(filter)
            .populate('subjectRef', 'code name')
            .populate('createdBy', 'name')
            .populate('steps.resources', 'title type provider averageRating totalRatings')
            .sort({ type: 1, difficulty: 1, createdAt: -1 });

        res.json(roadmaps);
    } catch (error) {
        console.error('Failed to fetch roadmaps:', error);
        res.status(500).json({ message: 'Failed to fetch roadmaps' });
    }
};

// Get single roadmap with full details
export const getRoadmapById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const roadmap = await Roadmap.findById(id)
            .populate('subjectRef', 'code name')
            .populate('createdBy', 'name')
            .populate('steps.resources', 'title type url description provider averageRating totalRatings');

        if (!roadmap) {
            return res.status(404).json({ message: 'Roadmap not found' });
        }

        res.json(roadmap);
    } catch (error) {
        console.error('Failed to fetch roadmap:', error);
        res.status(500).json({ message: 'Failed to fetch roadmap' });
    }
};

// Create new roadmap (moderator/admin only)
export const createRoadmap = async (req: Request, res: Response) => {
    try {
        const roadmapData = {
            ...req.body,
            createdBy: req.user?.userId
        };

        // Calculate total estimated hours from steps
        if (roadmapData.steps && roadmapData.steps.length > 0) {
            roadmapData.totalEstimatedHours = roadmapData.steps.reduce(
                (total: number, step: any) => total + (step.estimatedHours || 0),
                0
            );
        }

        const roadmap = new Roadmap(roadmapData);
        await roadmap.save();

        const populatedRoadmap = await Roadmap.findById(roadmap._id)
            .populate('subjectRef', 'code name')
            .populate('createdBy', 'name')
            .populate('steps.resources', 'title type provider averageRating totalRatings');

        res.status(201).json(populatedRoadmap);
    } catch (error) {
        console.error('Failed to create roadmap:', error);
        res.status(400).json({ message: 'Failed to create roadmap' });
    }
};

// Update roadmap (creator/admin only)
export const updateRoadmap = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const userRole = req.user?.role;

        const roadmap = await Roadmap.findById(id);
        if (!roadmap) {
            return res.status(404).json({ message: 'Roadmap not found' });
        }

        // Check permissions (creator or admin)
        if (roadmap.createdBy.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this roadmap' });
        }

        // Calculate total estimated hours if steps are updated
        if (req.body.steps && req.body.steps.length > 0) {
            req.body.totalEstimatedHours = req.body.steps.reduce(
                (total: number, step: any) => total + (step.estimatedHours || 0),
                0
            );
        }

        const updatedRoadmap = await Roadmap.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate('subjectRef', 'code name')
            .populate('createdBy', 'name')
            .populate('steps.resources', 'title type provider averageRating totalRatings');

        res.json(updatedRoadmap);
    } catch (error) {
        console.error('Failed to update roadmap:', error);
        res.status(400).json({ message: 'Failed to update roadmap' });
    }
};

// Delete roadmap (creator/admin only)
export const deleteRoadmap = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const userRole = req.user?.role;

        const roadmap = await Roadmap.findById(id);
        if (!roadmap) {
            return res.status(404).json({ message: 'Roadmap not found' });
        }

        // Check permissions (creator or admin)
        if (roadmap.createdBy.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this roadmap' });
        }

        await Roadmap.findByIdAndDelete(id);
        res.json({ message: 'Roadmap deleted successfully' });
    } catch (error) {
        console.error('Failed to delete roadmap:', error);
        res.status(500).json({ message: 'Failed to delete roadmap' });
    }
};
