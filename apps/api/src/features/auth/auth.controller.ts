import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { env } from '../../config/env.js';

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const result = await authService.register(name, email, password);

        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Registration failed' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);

        // Set cookies
        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: env.COOKIE_SECURE,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: env.COOKIE_SECURE,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({
            message: 'Login successful',
            user: result.user,
            tokens: {
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
            },
        });
    } catch (error) {
        res.status(401).json({ message: error instanceof Error ? error.message : 'Login failed' });
    }
};

export const refresh = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        const result = await authService.refreshToken(refreshToken);

        // Set new cookies
        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: env.COOKIE_SECURE,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: env.COOKIE_SECURE,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({
            message: 'Token refreshed',
            tokens: {
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
            },
        });
    } catch (error) {
        res.status(401).json({ message: error instanceof Error ? error.message : 'Token refresh failed' });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        // Clear cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: 'Logout failed' });
    }
};

export const me = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        res.json({ user: req.user });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get user info' });
    }
};

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const result = await authService.verifyEmail(token);

        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Email verification failed' });
    }
};

export const resendVerificationEmail = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const result = await authService.resendVerificationEmail(email);

        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to resend verification email' });
    }
};
