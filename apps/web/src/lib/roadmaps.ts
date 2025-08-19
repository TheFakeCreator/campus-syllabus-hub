import api from './api';
import type { RoadmapDTO, RoadmapFilters, CreateRoadmapRequest, RatingDTO } from '../types/api';

export interface RoadmapResponse {
    roadmaps: RoadmapDTO[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface RatingsResponse {
    ratings: RatingDTO[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

// Get all roadmaps with filtering
export const getRoadmaps = async (filters: RoadmapFilters = {}): Promise<RoadmapResponse> => {
    const params = new URLSearchParams();

    if (filters.branch) params.append('branch', filters.branch);
    if (filters.type) params.append('type', filters.type);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/roadmaps?${params.toString()}`);
    return response.data;
};

// Get roadmaps for a specific subject
export const getRoadmapsBySubject = async (subjectCode: string): Promise<RoadmapDTO[]> => {
    const response = await api.get(`/roadmaps/subject/${subjectCode}`);
    return response.data;
};

// Get a single roadmap by ID
export const getRoadmapById = async (id: string): Promise<RoadmapDTO> => {
    const response = await api.get(`/roadmaps/${id}`);
    return response.data;
};

// Create a new roadmap (requires authentication)
export const createRoadmap = async (roadmapData: CreateRoadmapRequest): Promise<RoadmapDTO> => {
    const response = await api.post('/roadmaps', roadmapData);
    return response.data;
};

// Update a roadmap (requires authentication)
export const updateRoadmap = async (id: string, roadmapData: Partial<CreateRoadmapRequest>): Promise<RoadmapDTO> => {
    const response = await api.patch(`/roadmaps/${id}`, roadmapData);
    return response.data;
};

// Delete a roadmap (requires authentication)
export const deleteRoadmap = async (id: string): Promise<void> => {
    await api.delete(`/roadmaps/${id}`);
};

// Get all ratings
export const getAllRatings = async (page = 1, limit = 10): Promise<RatingsResponse> => {
    const response = await api.get(`/ratings?page=${page}&limit=${limit}`);
    return response.data;
};

// Get ratings for a specific resource
export const getResourceRatings = async (resourceId: string, page = 1, limit = 10): Promise<RatingsResponse> => {
    const response = await api.get(`/ratings/resource/${resourceId}?page=${page}&limit=${limit}`);
    return response.data;
};

// Create or update a rating for a resource (requires authentication)
export const createOrUpdateRating = async (resourceId: string, rating: number, review?: string): Promise<RatingDTO> => {
    const response = await api.post(`/ratings/resource/${resourceId}`, { rating, review });
    return response.data;
};

// Delete a rating (requires authentication)
export const deleteRating = async (resourceId: string, ratingId: string): Promise<void> => {
    await api.delete(`/ratings/resource/${resourceId}/${ratingId}`);
};

// Vote a rating as helpful (requires authentication)
export const voteRatingHelpful = async (ratingId: string): Promise<RatingDTO> => {
    const response = await api.post(`/ratings/${ratingId}/helpful`);
    return response.data;
};
