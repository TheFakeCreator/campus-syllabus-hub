import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Map, Clock, GraduationCap, ChevronRight } from 'lucide-react';
import { getRoadmaps } from '../lib/roadmaps';
import type { RoadmapDTO, RoadmapFilters } from '../types/api';

const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

const typeColors = {
    midsem: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    endsem: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    practical: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    general: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
};

export default function Roadmaps() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [roadmaps, setRoadmaps] = useState<RoadmapDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 12,
        totalPages: 0
    });

    const [filters, setFilters] = useState<RoadmapFilters>({
        branch: searchParams.get('branch') || undefined,
        type: (searchParams.get('type') as any) || undefined,
        difficulty: (searchParams.get('difficulty') as any) || undefined,
        page: parseInt(searchParams.get('page') || '1'),
        limit: 12
    });

    useEffect(() => {
        fetchRoadmaps();
    }, [filters]);

    const fetchRoadmaps = async () => {
        try {
            setLoading(true);
            const response = await getRoadmaps(filters);
            setRoadmaps(response.roadmaps);
            setPagination({
                total: response.total,
                page: response.page,
                limit: response.limit,
                totalPages: response.totalPages
            });
        } catch (err) {
            console.error('Failed to fetch roadmaps:', err);
            setError('Failed to load roadmaps');
        } finally {
            setLoading(false);
        }
    };

    const updateFilters = (newFilters: Partial<RoadmapFilters>) => {
        const updatedFilters = { ...filters, ...newFilters, page: 1 };
        setFilters(updatedFilters);

        // Update URL params
        const params = new URLSearchParams();
        if (updatedFilters.branch) params.set('branch', updatedFilters.branch);
        if (updatedFilters.type) params.set('type', updatedFilters.type);
        if (updatedFilters.difficulty) params.set('difficulty', updatedFilters.difficulty);
        if (updatedFilters.page && updatedFilters.page > 1) params.set('page', updatedFilters.page.toString());

        setSearchParams(params);
    };

    const handlePageChange = (newPage: number) => {
        const updatedFilters = { ...filters, page: newPage };
        setFilters(updatedFilters);

        const params = new URLSearchParams(searchParams);
        if (newPage > 1) {
            params.set('page', newPage.toString());
        } else {
            params.delete('page');
        }
        setSearchParams(params);
    };

    const clearFilters = () => {
        setFilters({ page: 1, limit: 12 });
        setSearchParams({});
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <Map className="h-8 w-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Study Roadmaps
                    </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Discover structured learning paths for your subjects. Follow step-by-step guidance for
                    midsem, endsem, and practical preparations.
                </p>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <Link
                        to="/roadmaps/create"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <GraduationCap className="h-5 w-5" />
                        Create Roadmap
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filters</h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Branch Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Branch
                        </label>
                        <select
                            value={filters.branch || ''}
                            onChange={(e) => updateFilters({ branch: e.target.value || undefined })}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                        >
                            <option value="">All Branches</option>
                            <option value="CSE">Computer Science</option>
                            <option value="ECE">Electronics & Communication</option>
                            <option value="ME">Mechanical Engineering</option>
                            <option value="CE">Civil Engineering</option>
                            <option value="EE">Electrical Engineering</option>
                        </select>
                    </div>

                    {/* Type Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Type
                        </label>
                        <select
                            value={filters.type || ''}
                            onChange={(e) => updateFilters({ type: (e.target.value as any) || undefined })}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                        >
                            <option value="">All Types</option>
                            <option value="midsem">Midsem Preparation</option>
                            <option value="endsem">Endsem Preparation</option>
                            <option value="practical">Practical/Lab</option>
                            <option value="general">General Study</option>
                        </select>
                    </div>

                    {/* Difficulty Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Difficulty
                        </label>
                        <select
                            value={filters.difficulty || ''}
                            onChange={(e) => updateFilters({ difficulty: (e.target.value as any) || undefined })}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                        >
                            <option value="">All Levels</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>

                    {/* Clear Filters */}
                    <div className="flex items-end">
                        <button
                            onClick={clearFilters}
                            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
                    <p className="text-red-800 dark:text-red-200">{error}</p>
                </div>
            )}

            {/* Results */}
            {!loading && !error && (
                <>
                    {/* Results Header */}
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-gray-600 dark:text-gray-300">
                            {pagination.total} roadmap{pagination.total !== 1 ? 's' : ''} found
                        </p>
                    </div>

                    {/* Roadmaps Grid */}
                    {roadmaps.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {roadmaps.map((roadmap) => (
                                <Link
                                    key={roadmap._id}
                                    to={`/roadmaps/${roadmap._id}`}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow p-6 group"
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[roadmap.type]}`}>
                                                    {roadmap.type.charAt(0).toUpperCase() + roadmap.type.slice(1)}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[roadmap.difficulty]}`}>
                                                    {roadmap.difficulty.charAt(0).toUpperCase() + roadmap.difficulty.slice(1)}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {roadmap.title}
                                            </h3>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                    </div>

                                    {/* Subject Info */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <GraduationCap className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            {roadmap.subjectRef.code} - {roadmap.subjectRef.name}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                                        {roadmap.description}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            <span>{roadmap.totalEstimatedHours}h</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Map className="h-4 w-4" />
                                            <span>{roadmap.steps.length} steps</span>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    {roadmap.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {roadmap.tags.slice(0, 3).map((tag) => (
                                                <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">
                                                    {tag}
                                                </span>
                                            ))}
                                            {roadmap.tags.length > 3 && (
                                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">
                                                    +{roadmap.tags.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No roadmaps found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                Try adjusting your filters or create a new roadmap.
                            </p>
                            <Link
                                to="/roadmaps/create"
                                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <GraduationCap className="h-5 w-5" />
                                Create First Roadmap
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page <= 1}
                                    className="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>

                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-2 text-sm rounded-lg ${page === pagination.page
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page >= pagination.totalPages}
                                    className="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
