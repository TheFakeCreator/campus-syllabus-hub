import { Request, Response } from 'express';
import { Resource } from '../resources/resource.model.js';
import { Subject } from '../catalog/subject.model.js';
import { Roadmap } from '../roadmaps/roadmap.model.js';
import { paginationSchema } from '../../utils/pagination.js';

export const searchResources = async (req: Request, res: Response) => {
    try {
        const { q, type, subject, page = 1, limit = 20 } = req.query;

        if (!q || typeof q !== 'string') {
            return res.status(400).json({ message: 'Search query is required' });
        }

        // Build search filter
        const filter: any = {
            isApproved: true,
            $text: { $search: q }
        };

        if (type && typeof type === 'string') {
            filter.type = type;
        }

        if (subject && typeof subject === 'string') {
            filter.subjectRef = subject;
        }

        const skip = (Number(page) - 1) * Number(limit);

        // Search resources with text score
        const [resources, total] = await Promise.all([
            Resource.find(filter, { score: { $meta: 'textScore' } })
                .populate('subjectRef', 'code name')
                .populate('addedBy', 'name')
                .sort({ score: { $meta: 'textScore' }, qualityScore: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Resource.countDocuments(filter)
        ]);

        res.json({
            resources,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            },
            query: q
        });
    } catch (error) {
        res.status(500).json({ message: 'Search failed' });
    }
};

export const searchSubjects = async (req: Request, res: Response) => {
    try {
        const { q, branch, semester, page = 1, limit = 20 } = req.query;

        if (!q || typeof q !== 'string') {
            return res.status(400).json({ message: 'Search query is required' });
        }

        // Build search filter
        const filter: any = {
            $text: { $search: q }
        };

        if (branch && typeof branch === 'string') {
            filter.branchRef = branch;
        }

        if (semester && typeof semester === 'string') {
            filter.semesterRef = semester;
        }

        const skip = (Number(page) - 1) * Number(limit);

        // Search subjects with text score
        const [subjects, total] = await Promise.all([
            Subject.find(filter, { score: { $meta: 'textScore' } })
                .populate('branchRef', 'code name')
                .populate('semesterRef', 'number')
                .sort({ score: { $meta: 'textScore' } })
                .skip(skip)
                .limit(Number(limit)),
            Subject.countDocuments(filter)
        ]);

        res.json({
            subjects,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            },
            query: q
        });
    } catch (error) {
        res.status(500).json({ message: 'Search failed' });
    }
};

export const globalSearch = async (req: Request, res: Response) => {
    try {
        const { q, page = 1, limit = 20 } = req.query;

        if (!q || typeof q !== 'string') {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const skip = (Number(page) - 1) * Number(limit);

        // Search resources, subjects, and roadmaps
        const [resources, subjects, roadmaps] = await Promise.all([
            Resource.find(
                { isApproved: true, $text: { $search: q } },
                { score: { $meta: 'textScore' } }
            )
                .populate('subjectRef', 'code name')
                .populate('addedBy', 'name')
                .sort({ score: { $meta: 'textScore' } })
                .limit(10), // Limit each type for mixed results

            Subject.find(
                { $text: { $search: q } },
                { score: { $meta: 'textScore' } }
            )
                .populate('branchRef', 'code name')
                .populate('semesterRef', 'number')
                .sort({ score: { $meta: 'textScore' } })
                .limit(10),

            Roadmap.find(
                { isApproved: true, isPublic: true, $text: { $search: q } },
                { score: { $meta: 'textScore' } }
            )
                .populate('subjectRef', 'code name')
                .populate('createdBy', 'name')
                .sort({ score: { $meta: 'textScore' } })
                .limit(10)
        ]);

        res.json({
            results: {
                resources,
                subjects,
                roadmaps
            },
            query: q
        });
    } catch (error) {
        res.status(500).json({ message: 'Global search failed' });
    }
};
