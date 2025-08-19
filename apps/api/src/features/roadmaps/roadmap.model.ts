import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRoadmapStep {
    title: string;
    description: string;
    order: number;
    estimatedHours: number;
    prerequisites?: string[];
    resources: Types.ObjectId[];
}

export interface IRoadmap extends Document {
    subjectRef: Types.ObjectId;
    type: 'midsem' | 'endsem' | 'practical' | 'general';
    title: string;
    description: string;
    totalEstimatedHours: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    steps: IRoadmapStep[];
    createdBy: Types.ObjectId;
    isPublic: boolean;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const RoadmapStepSchema = new Schema<IRoadmapStep>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, required: true },
    estimatedHours: { type: Number, required: true, min: 0.5, max: 100 },
    prerequisites: [{ type: String }],
    resources: [{ type: Schema.Types.ObjectId, ref: 'Resource' }]
});

const RoadmapSchema = new Schema<IRoadmap>({
    subjectRef: { type: Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    type: {
        type: String,
        enum: ['midsem', 'endsem', 'practical', 'general'],
        required: true,
        index: true
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    totalEstimatedHours: { type: Number, required: true, min: 1 },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true,
        index: true
    },
    steps: [RoadmapStepSchema],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isPublic: { type: Boolean, default: true, index: true },
    tags: [{ type: String, index: true }],
}, {
    timestamps: true
});

// Indexes for efficient querying
RoadmapSchema.index({ subjectRef: 1, type: 1 });
RoadmapSchema.index({ subjectRef: 1, difficulty: 1 });
RoadmapSchema.index({ tags: 1 });
RoadmapSchema.index({ createdBy: 1 });
RoadmapSchema.index({ isPublic: 1, subjectRef: 1 });

export const Roadmap = mongoose.model<IRoadmap>('Roadmap', RoadmapSchema);
