import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISemester extends Document {
    number: number;
    yearRef: Types.ObjectId;
}

const SemesterSchema = new Schema<ISemester>({
    number: { type: Number, required: true },
    yearRef: { type: Schema.Types.ObjectId, ref: 'Year', required: true },
});

SemesterSchema.index({ yearRef: 1, number: 1 }, { unique: true });

export const Semester = mongoose.model<ISemester>('Semester', SemesterSchema);
