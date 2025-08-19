import { useState } from 'react';
import { Star } from 'lucide-react';
import { createOrUpdateRating } from '../../lib/roadmaps';
import { useAuthStore } from '../../../store/auth';

interface RatingProps {
    resourceId: string;
    currentRating?: number;
    averageRating?: number;
    totalRatings?: number;
    onRatingUpdate?: (newRating: number) => void;
    className?: string;
}

export function StarRating({
    resourceId,
    currentRating = 0,
    averageRating = 0,
    totalRatings = 0,
    onRatingUpdate,
    className = ''
}: RatingProps) {
    const { isAuthenticated } = useAuthStore();
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userRating, setUserRating] = useState(currentRating);

    const handleRatingClick = async (rating: number) => {
        if (!isAuthenticated || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await createOrUpdateRating(resourceId, rating);
            setUserRating(rating);
            onRatingUpdate?.(rating);
        } catch (error) {
            console.error('Failed to submit rating:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const displayRating = hoveredRating || userRating || averageRating;

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* Star Rating */}
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        disabled={!isAuthenticated || isSubmitting}
                        onClick={() => handleRatingClick(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className={`p-1 transition-colors ${isAuthenticated ? 'hover:scale-110 cursor-pointer' : 'cursor-default'
                            } ${isSubmitting ? 'opacity-50' : ''}`}
                    >
                        <Star
                            className={`w-4 h-4 transition-colors ${star <= displayRating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                        />
                    </button>
                ))}
            </div>

            {/* Rating Info */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
                {averageRating > 0 && (
                    <>
                        <span className="font-medium">{averageRating.toFixed(1)}</span>
                        {totalRatings > 0 && (
                            <span className="ml-1">
                                ({totalRatings} rating{totalRatings !== 1 ? 's' : ''})
                            </span>
                        )}
                    </>
                )}
                {userRating > 0 && (
                    <span className="ml-2 text-blue-600 dark:text-blue-400 text-xs">
                        Your rating: {userRating}★
                    </span>
                )}
            </div>

            {!isAuthenticated && (
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    Login to rate
                </span>
            )}
        </div>
    );
}

export function SimpleStarDisplay({ rating, totalRatings, className = '' }: {
    rating: number;
    totalRatings?: number;
    className?: string;
}) {
    return (
        <div className={`flex items-center gap-1 ${className}`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-3 h-3 ${star <= rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                />
            ))}
            <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                {rating.toFixed(1)}
                {totalRatings && totalRatings > 0 && (
                    <span className="ml-1">({totalRatings})</span>
                )}
            </span>
        </div>
    );
}
