import React, { useEffect, useState } from 'react';
import { getUsers, updateUserRole, deleteUser } from '../lib/admin';
import type { AdminUser, PaginatedResponse } from '../lib/admin';
import { Search, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [newRole, setNewRole] = useState('');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response: PaginatedResponse<AdminUser> = await getUsers({
                page: pagination.page,
                limit: pagination.limit,
                search: search || undefined,
                role: roleFilter || undefined
            });

            if (response.users) {
                setUsers(response.users);
            }
            setPagination(response.pagination);
        } catch (err) {
            setError('Failed to load users');
            console.error('Users error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [pagination.page, search, roleFilter]);

    const handleUpdateRole = async (userId: string, role: string) => {
        try {
            await updateUserRole(userId, role);
            setEditingUser(null);
            setNewRole('');
            fetchUsers();
        } catch (err) {
            alert('Failed to update user role');
            console.error('Update role error:', err);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            await deleteUser(userId);
            fetchUsers();
        } catch (err) {
            alert('Failed to delete user');
            console.error('Delete user error:', err);
        }
    };

    const handlePageChange = (page: number) => {
        setPagination(prev => ({ ...prev, page }));
    }; if (loading && users.length === 0) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users Management</h1>
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users Management</h1>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Total: {pagination.total} users
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setPagination(prev => ({ ...prev, page: 1 }));
                                    fetchUsers();
                                }
                            }}
                            className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">All Roles</option>
                        <option value="student">Student</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                    <div className="text-red-700 dark:text-red-400">{error}</div>
                </div>
            )}

            {/* Users Table */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {user.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {user.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {editingUser?._id === user._id ? (
                                            <div className="flex items-center space-x-2">
                                                <select
                                                    value={newRole}
                                                    onChange={(e) => setNewRole(e.target.value)}
                                                    className="text-sm rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                >
                                                    <option value="">Select role</option>
                                                    <option value="student">Student</option>
                                                    <option value="moderator">Moderator</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                                <button
                                                    onClick={() => handleUpdateRole(user._id, newRole)}
                                                    disabled={!newRole}
                                                    className="text-green-600 hover:text-green-700 disabled:text-gray-400"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingUser(null);
                                                        setNewRole('');
                                                    }}
                                                    className="text-gray-600 hover:text-gray-700"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                                                ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                : user.role === 'moderator'
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                                }`}>
                                                {user.role}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => {
                                                    setEditingUser(user);
                                                    setNewRole(user.role);
                                                }}
                                                className="text-blue-600 hover:text-blue-700"
                                                title="Edit role"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="text-red-600 hover:text-red-700"
                                                title="Delete user"
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

                                {[...Array(pagination.pages)].map((_, i) => {
                                    const page = i + 1;
                                    if (
                                        page === 1 ||
                                        page === pagination.pages ||
                                        (page >= pagination.page - 2 && page <= pagination.page + 2)
                                    ) {
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
                                    } else if (
                                        page === pagination.page - 3 ||
                                        page === pagination.page + 3
                                    ) {
                                        return (
                                            <span key={page} className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                ...
                                            </span>
                                        );
                                    }
                                    return null;
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

            {loading && users.length > 0 && (
                <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
