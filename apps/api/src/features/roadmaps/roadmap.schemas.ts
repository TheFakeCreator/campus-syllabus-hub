import { z } from 'zod';

export const roadmapStepSchema = z.object({
    title: z.string().min(1, 'Step title is required').max(100),
    description: z.string().min(1, 'Step description is required').max(500),
    order: z.number().int().min(1, 'Order must be at least 1'),
    estimatedHours: z.number().min(0.5, 'Estimated hours must be at least 0.5').max(100),
    prerequisites: z.array(z.string()).optional(),
    resources: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid resource ID')).optional()
});

export const createRoadmapSchema = z.object({
    subjectRef: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid subject ID'),
    type: z.enum(['midsem', 'endsem', 'practical', 'general']),
    title: z.string().min(1, 'Title is required').max(100),
    description: z.string().min(1, 'Description is required').max(1000),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    steps: z.array(roadmapStepSchema).min(1, 'At least one step is required'),
    isPublic: z.boolean().optional().default(true),
    tags: z.array(z.string().max(30)).max(10).optional()
});

export const updateRoadmapSchema = createRoadmapSchema.partial().omit({ subjectRef: true });

export const ratingSchema = z.object({
    rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
    review: z.string().max(1000, 'Review must be at most 1000 characters').optional()
});

export const roadmapQuerySchema = z.object({
    type: z.enum(['midsem', 'endsem', 'practical', 'general']).optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional()
});
