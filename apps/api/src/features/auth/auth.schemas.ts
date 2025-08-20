import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const refreshSchema = z.object({
    refreshToken: z.string(),
});

export const logoutSchema = z.object({
    refreshToken: z.string(),
});

export const resendVerificationEmailSchema = z.object({
    email: z.string().email(),
});
