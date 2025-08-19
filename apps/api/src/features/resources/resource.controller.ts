import { Request, Response } from 'express';
import { Resource } from './resource.model.js';
import { Subject } from '../catalog/subject.model.js';
import { Branch } from '../catalog/branch.model.js';
import { Semester } from '../catalog/semester.model.js';
import { paginationSchema, searchQuerySchema } from '../../utils/pagination.js';

export const getResources = async (req: Request, res: Response) => {
    try {
        // Parse pagination and search parameters
        const paginationResult = paginationSchema.safeParse(req.query);
        const searchResult = searchQuerySchema.safeParse(req.query);

        if (!paginationResult.success || !searchResult.success) {
            return res.status(400).json({ message: 'Invalid query parameters' });
        }

        const { page = 1, limit = 20 } = paginationResult.data;
        const { q, type, branch, semester, subject, sort = 'createdAt' } = searchResult.data;

        // Build filter
        const filter: any = { isApproved: true };

        if (type) filter.type = type;
        if (subject) filter.subjectRef = subject;

        // Handle branch and semester filtering
        if (branch || semester) {
            const subjectFilter: any = {};

            if (branch) {
                // Find branch by code
                const branchDoc = await Branch.findOne({ code: branch });
                if (branchDoc) {
                    subjectFilter.branchRef = branchDoc._id;
                }
            }

            if (semester) {
                // Find semester by number
                const semesterDoc = await Semester.findOne({ number: parseInt(semester) });
                if (semesterDoc) {
                    subjectFilter.semesterRef = semesterDoc._id;
                }
            }

            // Find subjects matching the criteria
            const subjects = await Subject.find(subjectFilter).select('_id');
            const subjectIds = subjects.map(s => s._id);

            if (subjectIds.length > 0) {
                filter.subjectRef = { $in: subjectIds };
            } else {
                // No subjects found for the criteria, return empty result
                return res.json({
                    resources: [],
                    pagination: {
                        page,
                        limit,
                        total: 0,
                        pages: 0
                    }
                });
            }
        }

        // Build text search
        if (q) {
            filter.$text = { $search: q };
        }

        // Execute query with pagination
        const skip = (page - 1) * limit;
        const sortOrder = sort === 'qualityScore' ? -1 : -1; // Newest first by default

        const [resources, total] = await Promise.all([
            Resource.find(filter)
                .populate('subjectRef', 'code name')
                .populate('addedBy', 'name')
                .sort({ [sort]: sortOrder })
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
        res.status(500).json({ message: 'Failed to fetch resources' });
    }
};

export const getResourceById = async (req: Request, res: Response) => {
    try {
        const resource = await Resource.findById(req.params.id)
            .populate('subjectRef', 'code name')
            .populate('addedBy', 'name');

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        res.json(resource);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch resource' });
    }
};

export const createResource = async (req: Request, res: Response) => {
    try {
        const resourceData = {
            ...req.body,
            addedBy: req.user?.userId
        };

        const resource = new Resource(resourceData);
        await resource.save();

        const populatedResource = await Resource.findById(resource._id)
            .populate('subjectRef', 'code name')
            .populate('addedBy', 'name');

        res.status(201).json(populatedResource);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create resource' });
    }
};

export const updateResource = async (req: Request, res: Response) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Check if user owns the resource or is admin/moderator
        if (resource.addedBy.toString() !== req.user?.userId &&
            !['admin', 'moderator'].includes(req.user?.role || '')) {
            return res.status(403).json({ message: 'Not authorized to update this resource' });
        }

        Object.assign(resource, req.body);
        await resource.save();

        const updatedResource = await Resource.findById(resource._id)
            .populate('subjectRef', 'code name')
            .populate('addedBy', 'name');

        res.json(updatedResource);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update resource' });
    }
};

export const deleteResource = async (req: Request, res: Response) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Check if user owns the resource or is admin/moderator
        if (resource.addedBy.toString() !== req.user?.userId &&
            !['admin', 'moderator'].includes(req.user?.role || '')) {
            return res.status(403).json({ message: 'Not authorized to delete this resource' });
        }

        await Resource.findByIdAndDelete(req.params.id);
        res.json({ message: 'Resource deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete resource' });
    }
};

export const approveResource = async (req: Request, res: Response) => {
    try {
        // Only admins and moderators can approve resources
        if (!['admin', 'moderator'].includes(req.user?.role || '')) {
            return res.status(403).json({ message: 'Not authorized to approve resources' });
        }

        const resource = await Resource.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        ).populate('subjectRef', 'code name')
            .populate('addedBy', 'name');

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        res.json(resource);
    } catch (error) {
        res.status(500).json({ message: 'Failed to approve resource' });
    }
};
