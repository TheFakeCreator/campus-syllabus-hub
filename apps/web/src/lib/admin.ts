import api from './api';

export interface AdminStats {
    totalUsers: number;
    totalResources: number;
    totalSubjects: number;
    totalRoadmaps: number;
    pendingResources: number;
    activeUsers: number;
}

export interface RecentActivity {
    users: Array<{
        _id: string;
        name: string;
        email: string;
        role: string;
        createdAt: string;
    }>;
    resources: Array<{
        _id: string;
        title: string;
        type: string;
        subjectRef: {
            code: string;
            name: string;
        };
        addedBy: {
            name: string;
        };
        createdAt: string;
    }>;
}

export interface AdminUser {
    _id: string;
    name: string;
    email: string;
    role: 'student' | 'moderator' | 'admin';
    createdAt: string;
}

export interface AdminResource {
    _id: string;
    title: string;
    type: string;
    description?: string;
    url: string;
    provider?: string;
    isApproved: boolean;
    qualityScore: number;
    subjectRef: {
        _id: string;
        code: string;
        name: string;
    };
    addedBy: {
        _id: string;
        name: string;
        email: string;
    };
    createdAt: string;
}

export interface AdminSubject {
    _id: string;
    code: string;
    name: string;
    credits: number;
    topics: string[];
    branchRef: {
        _id: string;
        code: string;
        name: string;
    };
    semesterRef: {
        _id: string;
        number: number;
    };
}

export interface AdminBranch {
    _id: string;
    code: string;
    name: string;
}

export interface AdminRoadmap {
    _id: string;
    title: string;
    description: string;
    type: 'midsem' | 'endsem' | 'practical' | 'general';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    totalEstimatedHours: number;
    isPublic: boolean;
    isApproved: boolean;
    subjectRef: {
        _id: string;
        code: string;
        name: string;
    };
    createdBy: {
        _id: string;
        name: string;
        email: string;
    };
    createdAt: string;
}

export interface PaginatedResponse<T> {
    data?: T[];
    users?: T[];
    resources?: T[];
    subjects?: T[];
    branches?: T[];
    roadmaps?: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

// Dashboard
export const getDashboardStats = async (): Promise<{ stats: AdminStats; recentActivity: RecentActivity }> => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
};

// User Management
export const getUsers = async (params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
}): Promise<PaginatedResponse<AdminUser>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.role) queryParams.append('role', params.role);

    const response = await api.get(`/admin/users?${queryParams}`);
    return response.data;
};

export const updateUserRole = async (userId: string, role: string): Promise<{ user: AdminUser }> => {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
};

export const deleteUser = async (userId: string): Promise<void> => {
    await api.delete(`/admin/users/${userId}`);
};

// Resource Management
export const getResourcesAdmin = async (params: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    approved?: boolean;
}): Promise<PaginatedResponse<AdminResource>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.type) queryParams.append('type', params.type);
    if (params.approved !== undefined) queryParams.append('approved', params.approved.toString());

    const response = await api.get(`/admin/resources?${queryParams}`);
    return response.data;
};

export const approveResource = async (resourceId: string, approved: boolean): Promise<{ resource: AdminResource }> => {
    const response = await api.patch(`/admin/resources/${resourceId}/approve`, { approved });
    return response.data;
};

export const deleteResourceAdmin = async (resourceId: string): Promise<void> => {
    await api.delete(`/admin/resources/${resourceId}`);
};

// Subject Management
export const getSubjectsAdmin = async (params: {
    page?: number;
    limit?: number;
    search?: string;
    branch?: string;
}): Promise<PaginatedResponse<AdminSubject>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.branch) queryParams.append('branch', params.branch);

    const response = await api.get(`/admin/subjects?${queryParams}`);
    return response.data;
};

export const createSubject = async (subjectData: {
    code: string;
    name: string;
    branchRef: string;
    semesterRef: string;
    credits: number;
    topics?: string[];
}): Promise<AdminSubject> => {
    const response = await api.post('/admin/subjects', subjectData);
    return response.data;
};

export const updateSubject = async (subjectId: string, subjectData: Partial<{
    code: string;
    name: string;
    branchRef: string;
    semesterRef: string;
    credits: number;
    topics: string[];
}>): Promise<AdminSubject> => {
    const response = await api.patch(`/admin/subjects/${subjectId}`, subjectData);
    return response.data;
};

export const deleteSubject = async (subjectId: string): Promise<void> => {
    await api.delete(`/admin/subjects/${subjectId}`);
};

// Branch Management
export const getBranchesAdmin = async (): Promise<{ branches: AdminBranch[] }> => {
    const response = await api.get('/admin/branches');
    return response.data;
};

export const createBranch = async (branchData: {
    code: string;
    name: string;
}): Promise<AdminBranch> => {
    const response = await api.post('/admin/branches', branchData);
    return response.data;
};

export const updateBranch = async (branchId: string, branchData: Partial<{
    code: string;
    name: string;
}>): Promise<AdminBranch> => {
    const response = await api.patch(`/admin/branches/${branchId}`, branchData);
    return response.data;
};

export const deleteBranch = async (branchId: string): Promise<void> => {
    await api.delete(`/admin/branches/${branchId}`);
};

// Roadmap Management
export const getRoadmapsAdmin = async (params: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    difficulty?: string;
}): Promise<PaginatedResponse<AdminRoadmap>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.type) queryParams.append('type', params.type);
    if (params.difficulty) queryParams.append('difficulty', params.difficulty);

    const response = await api.get(`/admin/roadmaps?${queryParams}`);
    return response.data;
};

export const updateRoadmapAdmin = async (roadmapId: string, roadmapData: Partial<{
    title: string;
    description: string;
    category: string;
    difficulty: string;
    prerequisites: string[];
    steps: Array<{
        stepNumber: number;
        title: string;
        content: string;
        resources: string[];
        estimatedTime: string;
        prerequisites: string[];
        url?: string;
    }>;
}>): Promise<AdminRoadmap> => {
    const response = await api.patch(`/admin/roadmaps/${roadmapId}`, roadmapData);
    return response.data;
};

export const approveRoadmap = async (roadmapId: string, approved: boolean): Promise<{ roadmap: AdminRoadmap }> => {
    const response = await api.patch(`/admin/roadmaps/${roadmapId}/approve`, { approved });
    return response.data;
};

export const deleteRoadmapAdmin = async (roadmapId: string): Promise<void> => {
    await api.delete(`/admin/roadmaps/${roadmapId}`);
};
