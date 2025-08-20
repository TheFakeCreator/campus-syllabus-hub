import React, { useEffect, useState } from 'react';
import { getResourcesAdmin, approveResource, deleteResourceAdmin } from '../lib/admin';
import type { AdminResource, PaginatedResponse } from '../lib/admin';
import { Search, CheckCircle, XCircle, Trash2, ExternalLink, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

const AdminResources: React.FC = () => {
    const [resources, setResources] = useState<AdminResource[]>([]);
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
    const [approvalFilter, setApprovalFilter] = useState('');

    const fetchResources = async () => {
        try {
            setLoading(true);
            const response: PaginatedResponse<AdminResource> = await getResourcesAdmin({
                page: pagination.page,
                limit: pagination.limit,
                search: search || undefined,
                type: typeFilter || undefined,
                approved: approvalFilter === '' ? undefined : approvalFilter === 'true'
            });

            if (response.resources) {
                setResources(response.resources);
            }
            setPagination(response.pagination);
        } catch (err) {
            setError('Failed to load resources');
            console.error('Resources error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, [pagination.page, search, typeFilter, approvalFilter]);

    const handleApproveResource = async (resourceId: string, approved: boolean) => {
        try {
            await approveResource(resourceId, approved);
            alert(`Resource ${approved ? 'approved' : 'unapproved'} successfully`);
            fetchResources();
        } catch (err) {
            alert('Failed to update resource approval status');
            console.error('Approve resource error:', err);
        }
    };

    const handleDeleteResource = async (resourceId: string) => {
        if (!confirm('Are you sure you want to delete this resource?')) return;

        try {
            await deleteResourceAdmin(resourceId);
            fetchResources();
        } catch (err) {
            alert('Failed to delete resource');
            console.error('Delete resource error:', err);
        }
    };

    const handlePageChange = (page: number) => {
        setPagination(prev => ({ ...prev, page }));
    };

    if (loading && resources.length === 0) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resources Management</h1>
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resources Management</h1>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Total: {pagination.total} resources
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search resources..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setPagination(prev => ({ ...prev, page: 1 }));
                                    fetchResources();
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
                        <option value="syllabus">Syllabus</option>
                        <option value="lecture">Lecture</option>
                        <option value="notes">Notes</option>
                        <option value="book">Book</option>
                        <option value="practical">Practical</option>
                    </select>

                    <select
                        value={approvalFilter}
                        onChange={(e) => setApprovalFilter(e.target.value)}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">All Status</option>
                        <option value="true">Approved</option>
                        <option value="false">Pending</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                    <div className="text-red-700 dark:text-red-400">{error}</div>
                </div>
            )}

            {/* Resources List */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {resources.map((resource) => (
                        <div key={resource._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                                            {resource.title}
                                        </h3>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${resource.type === 'syllabus'
                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                            : resource.type === 'lecture'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                : resource.type === 'notes'
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                                    : resource.type === 'book'
                                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                            }`}>
                                            {resource.type}
                                        </span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${resource.isApproved
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                            }`}>
                                            {resource.isApproved ? 'Approved' : 'Pending'}
                                        </span>
                                    </div>

                                    {resource.description && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            {resource.description}
                                        </p>
                                    )}

                                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                        <span>{resource.subjectRef.code} - {resource.subjectRef.name}</span>
                                        <span>•</span>
                                        <span>Added by {resource.addedBy.name}</span>
                                        <span>•</span>
                                        <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
                                        {resource.provider && (
                                            <>
                                                <span>•</span>
                                                <span>{resource.provider}</span>
                                            </>
                                        )}
                                        <span>•</span>
                                        <span>Quality: {resource.qualityScore}/100</span>
                                    </div>

                                    <div className="mt-2">
                                        <a
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
                                        >
                                            View Resource
                                            <ExternalLink className="ml-1 h-3 w-3" />
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 ml-4">
                                    {!resource.isApproved && (
                                        <button
                                            onClick={() => handleApproveResource(resource._id, true)}
                                            className="text-green-600 hover:text-green-700 p-1"
                                            title="Approve resource"
                                        >
                                            <CheckCircle className="h-5 w-5" />
                                        </button>
                                    )}

                                    {resource.isApproved && (
                                        <button
                                            onClick={() => handleApproveResource(resource._id, false)}
                                            className="text-yellow-600 hover:text-yellow-700 p-1"
                                            title="Unapprove resource"
                                        >
                                            <XCircle className="h-5 w-5" />
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleDeleteResource(resource._id)}
                                        className="text-red-600 hover:text-red-700 p-1"
                                        title="Delete resource"
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

            {loading && resources.length > 0 && (
                <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
            )}

            {resources.length === 0 && !loading && (
                <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No resources found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Try adjusting your search or filter criteria.
                    </p>
                </div>
            )}
        </div>
    );
};

export default AdminResources;
