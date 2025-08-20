import React, { useEffect, useState } from 'react';
import {
    getSubjectsAdmin,
    createSubject,
    updateSubject,
    deleteSubject,
    getBranchesAdmin
} from '../lib/admin';
import type { AdminSubject, AdminBranch, PaginatedResponse } from '../lib/admin';
import { Search, Plus, Edit, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminSubjects: React.FC = () => {
    const [subjects, setSubjects] = useState<AdminSubject[]>([]);
    const [branches, setBranches] = useState<AdminBranch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });
    const [search, setSearch] = useState('');
    const [branchFilter, setBranchFilter] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingSubject, setEditingSubject] = useState<AdminSubject | null>(null);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        branchRef: '',
        semesterRef: '',
        credits: 0,
        topics: [] as string[]
    });

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            const response: PaginatedResponse<AdminSubject> = await getSubjectsAdmin({
                page: pagination.page,
                limit: pagination.limit,
                search: search || undefined,
                branch: branchFilter || undefined
            });

            if (response.subjects) {
                setSubjects(response.subjects);
            }
            setPagination(response.pagination);
        } catch (err) {
            setError('Failed to load subjects');
            console.error('Subjects error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchBranches = async () => {
        try {
            const response = await getBranchesAdmin();
            setBranches(response.branches);
        } catch (err) {
            console.error('Branches error:', err);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, [pagination.page, search, branchFilter]);

    useEffect(() => {
        fetchBranches();
    }, []);

    const handleCreateSubject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createSubject(formData);
            setShowCreateForm(false);
            resetForm();
            fetchSubjects();
        } catch (err) {
            alert('Failed to create subject');
            console.error('Create subject error:', err);
        }
    };

    const handleUpdateSubject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSubject) return;

        try {
            await updateSubject(editingSubject._id, formData);
            alert('Subject updated successfully');
            setEditingSubject(null);
            resetForm();
            setShowCreateForm(false);
            fetchSubjects();
        } catch (err) {
            alert('Failed to update subject');
            console.error('Update subject error:', err);
        }
    };

    const handleDeleteSubject = async (subjectId: string) => {
        if (!confirm('Are you sure you want to delete this subject?')) return;

        try {
            await deleteSubject(subjectId);
            fetchSubjects();
        } catch (err) {
            alert('Failed to delete subject');
            console.error('Delete subject error:', err);
        }
    };

    const resetForm = () => {
        setFormData({
            code: '',
            name: '',
            branchRef: '',
            semesterRef: '',
            credits: 0,
            topics: []
        });
    };

    const startEdit = (subject: AdminSubject) => {
        setEditingSubject(subject);
        setFormData({
            code: subject.code,
            name: subject.name,
            branchRef: subject.branchRef._id,
            semesterRef: subject.semesterRef._id,
            credits: subject.credits,
            topics: subject.topics
        });
        setShowCreateForm(true);
    };

    const handlePageChange = (page: number) => {
        setPagination(prev => ({ ...prev, page }));
    };

    if (loading && subjects.length === 0) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subjects Management</h1>
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <div className="animate-pulse space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subjects Management</h1>
                <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Total: {pagination.total} subjects
                    </div>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Subject
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search subjects..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setPagination(prev => ({ ...prev, page: 1 }));
                                    fetchSubjects();
                                }
                            }}
                            className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <select
                        value={branchFilter}
                        onChange={(e) => setBranchFilter(e.target.value)}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">All Branches</option>
                        {branches.map((branch) => (
                            <option key={branch._id} value={branch._id}>
                                {branch.code} - {branch.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Create/Edit Form */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                {editingSubject ? 'Edit Subject' : 'Create Subject'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowCreateForm(false);
                                    setEditingSubject(null);
                                    resetForm();
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={editingSubject ? handleUpdateSubject : handleCreateSubject} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Subject Code
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.code}
                                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="e.g., CS301"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Subject Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="e.g., Data Structures and Algorithms"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Credits
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    max="10"
                                    value={formData.credits}
                                    onChange={(e) => setFormData(prev => ({ ...prev, credits: parseInt(e.target.value) }))}
                                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateForm(false);
                                        setEditingSubject(null);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                                >
                                    {editingSubject ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                    <div className="text-red-700 dark:text-red-400">{error}</div>
                </div>
            )}

            {/* Subjects Table */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Subject
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Branch
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Semester
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Credits
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {subjects.map((subject) => (
                                <tr key={subject._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {subject.code}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {subject.name}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {subject.branchRef.code} - {subject.branchRef.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        Semester {subject.semesterRef.number}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {subject.credits}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => startEdit(subject)}
                                                className="text-blue-600 hover:text-blue-700"
                                                title="Edit subject"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSubject(subject._id)}
                                                className="text-red-600 hover:text-red-700"
                                                title="Delete subject"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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

            {loading && subjects.length > 0 && (
                <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
            )}

            {subjects.length === 0 && !loading && (
                <div className="text-center py-12">
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No subjects found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Get started by creating a new subject.
                    </p>
                </div>
            )}
        </div>
    );
};

export default AdminSubjects;
