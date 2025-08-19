import { User, IUser } from '../users/user.model.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/tokens.js';

export class AuthService {
    async register(name: string, email: string, password: string): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Create user
        const user = new User({
            name,
            email,
            passwordHash: password, // Will be hashed by pre-save hook
        });

        await user.save();

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
}
