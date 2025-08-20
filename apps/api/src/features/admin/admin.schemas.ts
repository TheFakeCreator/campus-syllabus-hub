import { z } from 'zod';

export const updateUserRoleSchema = z.object({
    role: z.enum(['student', 'moderator', 'admin'])
});

export const approveResourceSchema = z.object({
    approved: z.boolean()
});

export const createSubjectSchema = z.object({
    code: z.string().min(2).max(10),
    name: z.string().min(2).max(100),
    branchRef: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid branch ID'),
    semesterRef: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid semester ID'),
    credits: z.number().min(1).max(10),
    topics: z.array(z.string()).optional()
});

export const updateSubjectSchema = z.object({
    code: z.string().min(2).max(10).optional(),
    name: z.string().min(2).max(100).optional(),
    branchRef: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid branch ID').optional(),
    semesterRef: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid semester ID').optional(),
    credits: z.number().min(1).max(10).optional(),
    topics: z.array(z.string()).optional()
});

export const createBranchSchema = z.object({
    code: z.string().min(2).max(10),
    name: z.string().min(2).max(100)
});

export const updateBranchSchema = z.object({
    code: z.string().min(2).max(10).optional(),
    name: z.string().min(2).max(100).optional()
});

// Query pagination schema
export const paginationQuerySchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
        limit: z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
        search: z.string().optional(),
        role: z.enum(['student', 'moderator', 'admin']).optional(),
        type: z.enum(['syllabus', 'lecture', 'notes', 'book', 'practical']).optional(),
        approved: z.string().transform(val => val === 'true').optional(),
        branch: z.string().optional(),
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional()
    })
});
