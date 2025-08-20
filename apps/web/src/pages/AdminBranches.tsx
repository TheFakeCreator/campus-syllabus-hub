import React, { useEffect, useState } from 'react';
import { getBranchesAdmin, createBranch, updateBranch, deleteBranch } from '../lib/admin';
import type { AdminBranch } from '../lib/admin';
import { Plus, Edit, Trash2, GitBranch } from 'lucide-react';

const AdminBranches: React.FC = () => {
    const [branches, setBranches] = useState<AdminBranch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingBranch, setEditingBranch] = useState<AdminBranch | null>(null);
    const [formData, setFormData] = useState({
        code: '',
        name: ''
    });

    const fetchBranches = async () => {
        try {
            setLoading(true);
            const response = await getBranchesAdmin();
            setBranches(response.branches);
        } catch (err) {
            setError('Failed to load branches');
            console.error('Branches error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    const handleCreateBranch = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createBranch({
                code: formData.code,
                name: formData.name
            });
            setShowModal(false);
            setFormData({ code: '', name: '' });
            fetchBranches();
        } catch (err) {
            alert('Failed to create branch');
            console.error('Create branch error:', err);
        }
    };

    const handleUpdateBranch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBranch) return;

        try {
            await updateBranch(editingBranch._id, {
                code: formData.code,
                name: formData.name
            });
            alert('Branch updated successfully');
            setShowModal(false);
            setEditingBranch(null);
            setFormData({ code: '', name: '' });
            fetchBranches();
        } catch (err) {
            alert('Failed to update branch');
            console.error('Update branch error:', err);
        }
    };

    const handleDeleteBranch = async (branchId: string) => {
        if (!confirm('Are you sure you want to delete this branch? This will affect all related subjects.')) return;

        try {
            await deleteBranch(branchId);
            fetchBranches();
        } catch (err) {
            alert('Failed to delete branch');
            console.error('Delete branch error:', err);
        }
    };

    const openModal = (branch?: AdminBranch) => {
        if (branch) {
            setEditingBranch(branch);
            setFormData({
                code: branch.code,
                name: branch.name
            });
        } else {
            setEditingBranch(null);
            setFormData({ code: '', name: '' });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingBranch(null);
        setFormData({ code: '', name: '' });
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Branches Management</h1>
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Branches Management</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                >
                    <Plus className="h-4 w-4" />
                    <span>Add Branch</span>
                </button>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                    <div className="text-red-700 dark:text-red-400">{error}</div>
                </div>
            )}

            {/* Branches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {branches.map((branch) => (
                    <div key={branch._id} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                    <GitBranch className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        {branch.code}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {branch.name}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => openModal(branch)}
                                    className="text-blue-600 hover:text-blue-700 p-1"
                                    title="Edit branch"
                                >
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDeleteBranch(branch._id)}
                                    className="text-red-600 hover:text-red-700 p-1"
                                    title="Delete branch"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {branches.length === 0 && !loading && (
                <div className="text-center py-12">
                    <GitBranch className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No branches found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Get started by creating a new branch.
                    </p>
                    <div className="mt-6">
                        <button
                            onClick={() => openModal()}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Branch
                        </button>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeModal}></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={editingBranch ? handleUpdateBranch : handleCreateBranch}>
                                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                                {editingBranch ? 'Edit Branch' : 'Add New Branch'}
                                            </h3>
                                            <div className="mt-4 space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Branch Code
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.code}
                                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        placeholder="e.g., CSE"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Branch Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                        placeholder="e.g., Computer Science and Engineering"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        {editingBranch ? 'Update' : 'Create'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBranches;
