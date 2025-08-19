
export interface ApiResponse<T> {
    data: T;
    message?: string;
    error?: string;
}

export interface Paginated<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}

export interface SubjectDTO {
    code: string;
    name: string;
    credits: number;
    branch: string;
    year: number;
    semester: number;
}

export interface ResourceDTO {
    id: string;
    title: string;
    type: string;
    tags: string[];
    provider: string;
    providerFavicon: string;
    qualityScore: number;
    link: string;
}

export interface RoadmapStep {
    _id: string;
    title: string;
    description: string;
    order: number;
    estimatedHours: number;
    prerequisites: string[];
    resources: ResourceDTO[];
}

export interface RoadmapDTO {
    _id: string;
    subjectRef: {
        _id: string;
        code: string;
        name: string;
        branchRef: string;
    };
    type: 'midsem' | 'endsem' | 'practical' | 'general';
    title: string;
    description: string;
    totalEstimatedHours: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    steps: RoadmapStep[];
    createdBy: {
        _id: string;
        name: string;
    };
    isPublic: boolean;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

export interface RatingDTO {
    _id: string;
    resourceRef: {
        _id: string;
        title: string;
        type: string;
        provider: string;
    };
    userRef: {
        _id: string;
        name: string;
        email: string;
    };
    rating: number;
    review?: string;
    helpfulVotes: number;
    reportedCount: number;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface RoadmapFilters {
    branch?: string;
    type?: 'midsem' | 'endsem' | 'practical' | 'general';
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    page?: number;
    limit?: number;
}

export interface CreateRoadmapRequest {
    subjectCode: string;
    type: 'midsem' | 'endsem' | 'practical' | 'general';
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    steps: Omit<RoadmapStep, '_id'>[];
    tags: string[];
    isPublic: boolean;
}
