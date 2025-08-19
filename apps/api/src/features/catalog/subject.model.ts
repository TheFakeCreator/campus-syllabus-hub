import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISubject extends Document {
    code: string;
    name: string;
    branchRef: Types.ObjectId;
    semesterRef: Types.ObjectId;
    credits: number;
    topics: string[];
}

const SubjectSchema = new Schema<ISubject>({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    branchRef: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    semesterRef: { type: Schema.Types.ObjectId, ref: 'Semester', required: true, index: true },
    credits: { type: Number, required: true },
    topics: [{ type: String }],
});

SubjectSchema.index({ code: 1 }, { unique: true });
SubjectSchema.index({ branchRef: 1 });
SubjectSchema.index({ semesterRef: 1 });
SubjectSchema.index({ name: 'text', topics: 'text' });

export const Subject = mongoose.model<ISubject>('Subject', SubjectSchema);
