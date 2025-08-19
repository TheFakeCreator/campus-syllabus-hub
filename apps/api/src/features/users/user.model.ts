import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    role: 'student' | 'moderator' | 'admin';
    createdAt: Date;
    comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['student', 'moderator', 'admin'], default: 'student' },
    createdAt: { type: Date, default: Date.now },
});

UserSchema.index({ email: 1 }, { unique: true });

UserSchema.pre('save', async function (next) {
    if (this.isModified('passwordHash')) {
        this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
    }
    next();
});

UserSchema.methods.comparePassword = function (password: string) {
    return bcrypt.compare(password, this.passwordHash);
};

UserSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.passwordHash;
        return ret;
    },
});

export const User = mongoose.model<IUser>('User', UserSchema);
