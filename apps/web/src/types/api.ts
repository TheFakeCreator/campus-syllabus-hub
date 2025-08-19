export interface Branch {
    _id: string;
    code: string;
    name: string;
}

export interface Program {
    _id: string;
    code: string;
    name: string;
    branchRef: string;
    durationYears: number;
}

export interface Year {
    _id: string;
    year: number;
    programRef: string;
}

export interface Semester {
    _id: string;
    number: number;
    yearRef: string;
}

export interface Subject {
    _id: string;
    code: string;
    name: string;
    branchRef: string;
    semesterRef: string;
    credits: number;
    topics: string[];
}

export interface Resource {
    _id: string;
    type: 'syllabus' | 'lecture' | 'notes' | 'book';
    title: string;
    url: string;
    description?: string;
    provider?: string;
    subjectRef: string;
    topics: string[];
    tags: string[];
    addedBy: string;
    isApproved: boolean;
    qualityScore: number;
    createdAt: string;
}

export interface ResourceWithDetails extends Resource {
    subject?: Subject;
    branch?: Branch;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'student' | 'moderator' | 'admin';
    createdAt: string;
}

export interface PaginatedResponse<T> {
    data?: T[];
    resources?: T[];
    subjects?: T[];
    total: number;
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface ApiResponse<T = any> {
    message?: string;
    data?: T;
    error?: string;
}

export interface RoadmapStep {
    _id: string;
    title: string;
    description: string;
    order: number;
    estimatedHours: number;
    prerequisites: string[];
    resources: Resource[];
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
