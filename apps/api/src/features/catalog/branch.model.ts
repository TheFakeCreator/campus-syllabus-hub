import mongoose, { Schema, Document } from 'mongoose';

export interface IBranch extends Document {
    code: string;
    name: string;
}

const BranchSchema = new Schema<IBranch>({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
});

BranchSchema.index({ code: 1 }, { unique: true });

export const Branch = mongoose.model<IBranch>('Branch', BranchSchema);
