import { z } from 'zod';

export const createResourceSchema = z.object({
    type: z.enum(['syllabus', 'lecture', 'notes', 'book']),
    title: z.string().min(2),
    url: z.string().url(),
    description: z.string().optional(),
    provider: z.string().optional(),
    subjectRef: z.string(),
    topics: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    isApproved: z.boolean().optional(),
    qualityScore: z.number().min(0).max(100).optional(),
});

export const updateResourceSchema = createResourceSchema.partial();
