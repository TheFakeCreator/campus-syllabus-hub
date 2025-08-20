import { User, IUser } from '../users/user.model.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/tokens.js';
import { emailService } from '../../utils/emailService.js';
import crypto from 'crypto';

export class AuthService {
    async register(name: string, email: string, password: string): Promise<{ message: string; user: any }> {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // In development mode with disabled email, auto-verify the user
        const isDevelopmentMode = process.env.NODE_ENV === 'development' && process.env.DISABLE_EMAIL === 'true';

        // Create user
        const user = new User({
            name,
            email,
            passwordHash: password, // Will be hashed by pre-save hook
            isEmailVerified: isDevelopmentMode, // Auto-verify in development
            emailVerificationToken: isDevelopmentMode ? undefined : verificationToken,
            emailVerificationExpires: isDevelopmentMode ? undefined : verificationExpires,
        });

        await user.save();

        console.log('User saved with token:', {
            email: user.email,
            token: user.emailVerificationToken,
            expires: user.emailVerificationExpires,
            isVerified: user.isEmailVerified
        });

        let message = 'Registration successful. Please check your email to verify your account.';

        if (isDevelopmentMode) {
            message = 'Registration successful. Email verification is disabled in development mode - you can login immediately.';
        } else {
            // Send verification email
            try {
                await emailService.sendVerificationEmail(email, name, verificationToken);
            } catch (error) {
                // If email fails, still continue with registration but log error
                console.error('Failed to send verification email:', error);
            }
        }

        // Return user without sensitive data
        return {
            message,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
                createdAt: user.createdAt,
            }
        };
    }

    async login(email: string, password: string): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
        // Find user with password
        const user = await User.findOne({ email }).select('+passwordHash');
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Check password
        const isValid = await user.comparePassword(password);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        // Check if email is verified
        if (!user.isEmailVerified) {
            throw new Error('Please verify your email before logging in');
        }

        // Generate tokens
        const tokenPayload = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        };

        const accessToken = signAccessToken(tokenPayload);
        const refreshToken = signRefreshToken(tokenPayload);

        return { user, accessToken, refreshToken };
    }

    async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            const decoded = verifyRefreshToken(refreshToken);

            // Verify user still exists
            const user = await User.findById(decoded.userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Generate new tokens
            const tokenPayload = {
                userId: user._id.toString(),
                email: user.email,
                role: user.role,
            };

            const newAccessToken = signAccessToken(tokenPayload);
            const newRefreshToken = signRefreshToken(tokenPayload);

            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

    async verifyEmail(token: string): Promise<{ message: string; user: any }> {
        console.log('Verifying email with token:', token);

        // Find user with valid token that hasn't expired
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: new Date() },
        }).select('+emailVerificationToken +emailVerificationExpires');

        if (user) {
            console.log('Found valid user for verification:', user.email);

            // Verify the user
            user.isEmailVerified = true;
            user.emailVerificationToken = undefined;
            user.emailVerificationExpires = undefined;
            await user.save();

            console.log('Email verified successfully for user:', user.email);

            return {
                message: 'Email verified successfully',
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isEmailVerified: user.isEmailVerified,
                    createdAt: user.createdAt,
                }
            };
        }

        console.log('No user found with this token');
        throw new Error('Invalid verification token');
    }

    async resendVerificationEmail(email: string): Promise<{ message: string }> {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        if (user.isEmailVerified) {
            throw new Error('Email is already verified');
        }

        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        user.emailVerificationToken = verificationToken;
        user.emailVerificationExpires = verificationExpires;
        await user.save();

        // Send verification email
        await emailService.sendVerificationEmail(email, user.name, verificationToken);

        return { message: 'Verification email sent successfully' };
    }
}
