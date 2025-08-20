import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPrerequisite {
    title: string;
    description?: string;
    resourceLink?: string; // Optional link to existing resource
}

export interface IResource extends Document {
    type: 'syllabus' | 'lecture' | 'notes' | 'book';
    title: string;
    url: string;
    description: string;
    provider: string;
    subjectRef: Types.ObjectId;
    topics: string[];
    tags: string[];
    prerequisites: IPrerequisite[]; // New field for prerequisites
    addedBy: Types.ObjectId;
    isApproved: boolean;
    qualityScore: number;
    // Rating aggregation fields
    averageRating: number;
    totalRatings: number;
    ratingDistribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
    createdAt: Date;
}

const PrerequisiteSchema = new Schema<IPrerequisite>({
    title: { type: String, required: true },
    description: { type: String },
    resourceLink: { type: String }
}, { _id: false });

const ResourceSchema = new Schema<IResource>({
    type: { type: String, enum: ['syllabus', 'lecture', 'notes', 'book'], required: true, index: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String },
    provider: { type: String },
    subjectRef: { type: Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    topics: [{ type: String }],
    tags: [{ type: String, index: true }],
    prerequisites: [PrerequisiteSchema], // New field for prerequisites
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isApproved: { type: Boolean, default: false },
    qualityScore: { type: Number, min: 0, max: 100, default: 0 },
    // Rating aggregation fields
    averageRating: { type: Number, min: 0, max: 5, default: 0 },
    totalRatings: { type: Number, min: 0, default: 0 },
    ratingDistribution: {
        1: { type: Number, min: 0, default: 0 },
        2: { type: Number, min: 0, default: 0 },
        3: { type: Number, min: 0, default: 0 },
        4: { type: Number, min: 0, default: 0 },
        5: { type: Number, min: 0, default: 0 }
    },
    createdAt: { type: Date, default: Date.now },
});

ResourceSchema.index({ subjectRef: 1 });
ResourceSchema.index({ type: 1 });
ResourceSchema.index({ tags: 1 });
ResourceSchema.index({ title: 'text', description: 'text', tags: 'text' });

export const Resource = mongoose.model<IResource>('Resource', ResourceSchema);
