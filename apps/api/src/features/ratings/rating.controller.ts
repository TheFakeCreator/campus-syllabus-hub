import { Request, Response } from 'express';
import { ResourceRating } from './rating.model.js';
import { Resource } from '../resources/resource.model.js';
import { paginationSchema } from '../../utils/pagination.js';

// Get all ratings (for admin purposes)
export const getAllRatings = async (req: Request, res: Response) => {
    try {
        const paginationResult = paginationSchema.safeParse(req.query);

        if (!paginationResult.success) {
            return res.status(400).json({ message: 'Invalid pagination parameters' });
        }

        const { page = 1, limit = 10 } = paginationResult.data;
        const skip = (page - 1) * limit;

        const [ratings, total] = await Promise.all([
            ResourceRating.find()
                .populate('userRef', 'name email')
                .populate('resourceRef', 'title type provider')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            ResourceRating.countDocuments()
        ]);

        res.json({
            ratings,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Failed to fetch all ratings:', error);
        res.status(500).json({ message: 'Failed to fetch ratings' });
    }
};

// Get ratings for a resource
export const getResourceRatings = async (req: Request, res: Response) => {
    try {
        const { resourceId } = req.params;
        const paginationResult = paginationSchema.safeParse(req.query);

        if (!paginationResult.success) {
            return res.status(400).json({ message: 'Invalid pagination parameters' });
        }

        const { page = 1, limit = 10 } = paginationResult.data;
        const skip = (page - 1) * limit;

        const [ratings, total] = await Promise.all([
            ResourceRating.find({ resourceRef: resourceId })
                .populate('userRef', 'name')
                .sort({ helpfulVotes: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit),
            ResourceRating.countDocuments({ resourceRef: resourceId })
        ]);

        res.json({
            ratings,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Failed to fetch ratings:', error);
        res.status(500).json({ message: 'Failed to fetch ratings' });
    }
};

// Create or update rating
export const createOrUpdateRating = async (req: Request, res: Response) => {
    try {
        const { resourceId } = req.params;
        const { rating, review } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (!rating || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
            return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
        }

        // Check if resource exists
        const resource = await Resource.findById(resourceId);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Create or update rating
        const existingRating = await ResourceRating.findOne({
            resourceRef: resourceId,
            userRef: userId
        });

        let ratingDoc;
        if (existingRating) {
            // Update existing rating
            existingRating.rating = rating;
            existingRating.review = review;
            await existingRating.save();
            ratingDoc = existingRating;
        } else {
            // Create new rating
            ratingDoc = new ResourceRating({
                resourceRef: resourceId,
                userRef: userId,
                rating,
                review
            });
            await ratingDoc.save();
        }

        // Update resource rating aggregates
        await updateResourceRatingAggregates(resourceId);

        const populatedRating = await ResourceRating.findById(ratingDoc._id)
            .populate('userRef', 'name');

        res.status(201).json(populatedRating);
    } catch (error) {
        console.error('Failed to create/update rating:', error);
        res.status(400).json({ message: 'Failed to create/update rating' });
    }
};

// Delete rating
export const deleteRating = async (req: Request, res: Response) => {
    try {
        const { resourceId, ratingId } = req.params;
        const userId = req.user?.userId;
        const userRole = req.user?.role;

        const rating = await ResourceRating.findById(ratingId);
        if (!rating) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        // Check permissions (rating owner or admin)
        if (rating.userRef.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this rating' });
        }

        await ResourceRating.findByIdAndDelete(ratingId);

        // Update resource rating aggregates
        await updateResourceRatingAggregates(resourceId);

        res.json({ message: 'Rating deleted successfully' });
    } catch (error) {
        console.error('Failed to delete rating:', error);
        res.status(500).json({ message: 'Failed to delete rating' });
    }
};

// Vote helpful on rating
export const voteHelpful = async (req: Request, res: Response) => {
    try {
        const { ratingId } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const rating = await ResourceRating.findById(ratingId);
        if (!rating) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        // Increment helpful votes
        rating.helpfulVotes += 1;
        await rating.save();

        res.json({ message: 'Vote recorded', helpfulVotes: rating.helpfulVotes });
    } catch (error) {
        console.error('Failed to vote helpful:', error);
        res.status(500).json({ message: 'Failed to vote helpful' });
    }
};

// Helper function to update resource rating aggregates
async function updateResourceRatingAggregates(resourceId: string) {
    try {
        const ratings = await ResourceRating.find({ resourceRef: resourceId });

        if (ratings.length === 0) {
            await Resource.findByIdAndUpdate(resourceId, {
                averageRating: 0,
                totalRatings: 0,
                ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            });
            return;
        }

        const totalRatings = ratings.length;
        const sumRatings = ratings.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = sumRatings / totalRatings;

        // Calculate rating distribution
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratings.forEach(r => {
            distribution[r.rating as keyof typeof distribution]++;
        });

        await Resource.findByIdAndUpdate(resourceId, {
            averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
            totalRatings,
            ratingDistribution: distribution
        });
    } catch (error) {
        console.error('Failed to update rating aggregates:', error);
    }
}
