import { z } from 'zod';

export const createSubjectSchema = z.object({
    code: z.string().min(2),
    name: z.string().min(2),
    branchRef: z.string(),
    semesterRef: z.string(),
    credits: z.number().min(0),
    topics: z.array(z.string()).optional(),
});

export const updateSubjectSchema = createSubjectSchema.partial();
