import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IResourceRating extends Document {
    resourceRef: Types.ObjectId;
    userRef: Types.ObjectId;
    rating: number; // 1-5 stars
    review?: string;
    helpfulVotes: number;
    reportedCount: number;
    isVerified: boolean; // For verified students/instructors
    createdAt: Date;
    updatedAt: Date;
}

const ResourceRatingSchema = new Schema<IResourceRating>({
    resourceRef: { type: Schema.Types.ObjectId, ref: 'Resource', required: true, index: true },
    userRef: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        validate: {
            validator: Number.isInteger,
            message: 'Rating must be an integer between 1 and 5'
        }
    },
    review: {
        type: String,
        maxlength: 1000,
        trim: true
    },
    helpfulVotes: { type: Number, default: 0, min: 0 },
    reportedCount: { type: Number, default: 0, min: 0 },
    isVerified: { type: Boolean, default: false, index: true }
}, {
    timestamps: true
});

// Ensure one rating per user per resource
ResourceRatingSchema.index({ resourceRef: 1, userRef: 1 }, { unique: true });

// Indexes for aggregation queries
ResourceRatingSchema.index({ resourceRef: 1, rating: 1 });
ResourceRatingSchema.index({ resourceRef: 1, isVerified: 1 });
ResourceRatingSchema.index({ userRef: 1, createdAt: -1 });

export const ResourceRating = mongoose.model<IResourceRating>('ResourceRating', ResourceRatingSchema);
