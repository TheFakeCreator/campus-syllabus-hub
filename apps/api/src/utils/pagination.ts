import { z } from 'zod';

export const paginationSchema = z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});

export const safeSortFields = ['createdAt', 'qualityScore', 'title', 'name'];

export const searchQuerySchema = z.object({
    q: z.string().optional(),
    type: z.enum(['syllabus', 'lecture', 'notes', 'book']).optional(),
    branch: z.string().optional(),
    semester: z.string().optional(),
    subject: z.string().optional(),
    sort: z.enum(safeSortFields as [string, ...string[]]).optional(),
});
