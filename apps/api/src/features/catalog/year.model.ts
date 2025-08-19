import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IYear extends Document {
    year: number;
    programRef: Types.ObjectId;
}

const YearSchema = new Schema<IYear>({
    year: { type: Number, required: true },
    programRef: { type: Schema.Types.ObjectId, ref: 'Program', required: true },
});

YearSchema.index({ programRef: 1, year: 1 }, { unique: true });

export const Year = mongoose.model<IYear>('Year', YearSchema);
