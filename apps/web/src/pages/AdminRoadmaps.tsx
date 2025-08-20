import React, { useEffect, useState } from 'react';
import { getRoadmapsAdmin, updateRoadmapAdmin, approveRoadmap, deleteRoadmapAdmin } from '../lib/admin';
import type { AdminRoadmap, PaginatedResponse } from '../lib/admin';
import { Search, Trash2, ExternalLink, ChevronLeft, ChevronRight, Map, CheckCircle, XCircle, Edit } from 'lucide-react';

const AdminRoadmaps: React.FC = () => {
    const [roadmaps, setRoadmaps] = useState<AdminRoadmap[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('');

    const fetchRoadmaps = async () => {
        try {
            setLoading(true);
            const response: PaginatedResponse<AdminRoadmap> = await getRoadmapsAdmin({
                page: pagination.page,
                limit: pagination.limit,
                search: search || undefined,
                type: typeFilter || undefined,
                difficulty: difficultyFilter || undefined
            });

            if (response.roadmaps) {
                setRoadmaps(response.roadmaps);
            }
            setPagination(response.pagination);
        } catch (err) {
            setError('Failed to load roadmaps');
            console.error('Roadmaps error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoadmaps();
    }, [pagination.page, search, typeFilter, difficultyFilter]);

    const handleDeleteRoadmap = async (roadmapId: string) => {
        if (!confirm('Are you sure you want to delete this roadmap?')) return;

        try {
            await deleteRoadmapAdmin(roadmapId);
            fetchRoadmaps();
        } catch (err) {
            alert('Failed to delete roadmap');
            console.error('Delete roadmap error:', err);
        }
    };

    const handleApproveRoadmap = async (roadmapId: string, approved: boolean) => {
        try {
            await approveRoadmap(roadmapId, approved);
            alert(`Roadmap ${approved ? 'approved' : 'unapproved'} successfully`);
            fetchRoadmaps();
        } catch (err) {
            alert('Failed to update roadmap approval status');
            console.error('Approve roadmap error:', err);
        }
    };

    const handlePageChange = (page: number) => {
        setPagination(prev => ({ ...prev, page }));
    };

    if (loading && roadmaps.length === 0) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Roadmaps Management</h1>
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <div className="animate-pulse space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Roadmaps Management</h1>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Total: {pagination.total} roadmaps
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search roadmaps..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setPagination(prev => ({ ...prev, page: 1 }));
                                    fetchRoadmaps();
                                }
                            }}
                            className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">All Types</option>
                        <option value="midsem">Mid Semester</option>
                        <option value="endsem">End Semester</option>
                        <option value="practical">Practical</option>
                        <option value="general">General</option>
                    </select>

                    <select
                        value={difficultyFilter}
                        onChange={(e) => setDifficultyFilter(e.target.value)}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">All Difficulty</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                    <div className="text-red-700 dark:text-red-400">{error}</div>
                </div>
            )}

            {/* Roadmaps List */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {roadmaps.map((roadmap) => (
                        <div key={roadmap._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                                            {roadmap.title}
                                        </h3>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roadmap.type === 'midsem'
                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                            : roadmap.type === 'endsem'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                : roadmap.type === 'practical'
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                            }`}>
                                            {roadmap.type}
                                        </span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roadmap.difficulty === 'beginner'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                            : roadmap.difficulty === 'intermediate'
                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                            }`}>
                                            {roadmap.difficulty}
                                        </span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roadmap.isPublic
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                            }`}>
                                            {roadmap.isPublic ? 'Public' : 'Private'}
                                        </span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roadmap.isApproved
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                            }`}>
                                            {roadmap.isApproved ? 'Approved' : 'Pending'}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        {roadmap.description}
                                    </p>

                                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                        <span>{roadmap.subjectRef.code} - {roadmap.subjectRef.name}</span>
                                        <span>•</span>
                                        <span>Created by {roadmap.createdBy.name}</span>
                                        <span>•</span>
                                        <span>{roadmap.totalEstimatedHours}h estimated</span>
                                        <span>•</span>
                                        <span>{new Date(roadmap.createdAt).toLocaleDateString()}</span>
                                    </div>

                                    <div className="mt-2">
                                        <a
                                            href={`/roadmaps/${roadmap._id}`}
                                            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
                                        >
                                            View Roadmap
                                            <ExternalLink className="ml-1 h-3 w-3" />
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 ml-4">
                                    {!roadmap.isApproved && (
                                        <button
                                            onClick={() => handleApproveRoadmap(roadmap._id, true)}
                                            className="text-green-600 hover:text-green-700 p-1"
                                            title="Approve roadmap"
                                        >
                                            <CheckCircle className="h-5 w-5" />
                                        </button>
                                    )}

                                    {roadmap.isApproved && (
                                        <button
                                            onClick={() => handleApproveRoadmap(roadmap._id, false)}
                                            className="text-yellow-600 hover:text-yellow-700 p-1"
                                            title="Unapprove roadmap"
                                        >
                                            <XCircle className="h-5 w-5" />
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleDeleteRoadmap(roadmap._id)}
                                        className="text-red-600 hover:text-red-700 p-1"
                                        title="Delete roadmap"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                                {pagination.total} results
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>

                                {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
                                    const page = i + 1;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === pagination.page
                                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400'
                                                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.pages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {loading && roadmaps.length > 0 && (
                <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
            )}

            {roadmaps.length === 0 && !loading && (
                <div className="text-center py-12">
                    <Map className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No roadmaps found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        No roadmaps match your current filter criteria.
                    </p>
                </div>
            )}
        </div>
    );
};

export default AdminRoadmaps;
