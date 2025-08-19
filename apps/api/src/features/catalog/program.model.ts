import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProgram extends Document {
    code: string;
    name: string;
    branchRef: Types.ObjectId;
    durationYears: number;
}

const ProgramSchema = new Schema<IProgram>({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    branchRef: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    durationYears: { type: Number, required: true },
});

ProgramSchema.index({ code: 1 }, { unique: true });
ProgramSchema.index({ branchRef: 1 });

export const Program = mongoose.model<IProgram>('Program', ProgramSchema);
