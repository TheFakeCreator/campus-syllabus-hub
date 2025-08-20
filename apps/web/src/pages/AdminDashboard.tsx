import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../lib/admin';
import type { AdminStats, RecentActivity } from '../lib/admin';
import { Users, FileText, BookOpen, Map, Clock, TrendingUp } from 'lucide-react';

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [recentActivity, setRecentActivity] = useState<RecentActivity | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await getDashboardStats();
                setStats(data.stats);
                setRecentActivity(data.recentActivity);
            } catch (err) {
                setError('Failed to load dashboard data');
                console.error('Dashboard error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg animate-pulse">
                            <div className="p-5">
                                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    const statCards = [
        {
            name: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100 dark:bg-blue-900/20'
        },
        {
            name: 'Total Resources',
            value: stats?.totalResources || 0,
            icon: FileText,
            color: 'text-green-600',
            bgColor: 'bg-green-100 dark:bg-green-900/20'
        },
        {
            name: 'Total Subjects',
            value: stats?.totalSubjects || 0,
            icon: BookOpen,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100 dark:bg-purple-900/20'
        },
        {
            name: 'Total Roadmaps',
            value: stats?.totalRoadmaps || 0,
            icon: Map,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100 dark:bg-orange-900/20'
        }
    ];

    const alertCards = [
        {
            name: 'Pending Resources',
            value: stats?.pendingResources || 0,
            icon: Clock,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
        },
        {
            name: 'Active Users',
            value: stats?.activeUsers || 0,
            icon: TrendingUp,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-100 dark:bg-indigo-900/20'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Last updated: {new Date().toLocaleTimeString()}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div key={item.name} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className={`p-3 rounded-md ${item.bgColor}`}>
                                            <Icon className={`h-6 w-6 ${item.color}`} />
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                                {item.name}
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                                {item.value.toLocaleString()}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Alert Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {alertCards.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div key={item.name} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className={`p-3 rounded-md ${item.bgColor}`}>
                                            <Icon className={`h-6 w-6 ${item.color}`} />
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                                {item.name}
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                                {item.value.toLocaleString()}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Recent Users */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                            Recent Users
                        </h3>
                        <div className="space-y-3">
                            {recentActivity?.users.slice(0, 5).map((user) => (
                                <div key={user._id} className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {user.name}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {user.email}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                                                ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                : user.role === 'moderator'
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                            }`}>
                                            {user.role}
                                        </span>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Resources */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                            Recent Resources
                        </h3>
                        <div className="space-y-3">
                            {recentActivity?.resources.slice(0, 5).map((resource) => (
                                <div key={resource._id} className="flex items-center justify-between py-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {resource.title}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {resource.subjectRef.code} • {resource.addedBy.name}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${resource.type === 'syllabus'
                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                                : resource.type === 'lecture'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                    : resource.type === 'notes'
                                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                                            }`}>
                                            {resource.type}
                                        </span>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {new Date(resource.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
