import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, BookOpen, Upload } from 'lucide-react';
import api from '../lib/api.ts';
import { useAuthStore } from '../store/auth.ts';
import type { ResourceWithDetails } from '../types/api.ts';

const Profile = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuthStore();
    const [userResources, setUserResources] = useState<ResourceWithDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'resources' | 'settings'>('resources');

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Fetch user's resources
    useEffect(() => {
        const fetchUserResources = async () => {
            if (!user) return;

            setIsLoading(true);
            try {
                const response = await api.get(`/resources?addedBy=${user._id}`);
                setUserResources(response.data.resources || []);
            } catch (error) {
                console.error('Failed to fetch user resources:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchUserResources();
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!isAuthenticated || !user) {
        return null; // Will redirect
    }

    const getResourceIcon = (type: string) => {
        switch (type) {
            case 'lecture':
                return '🎥';
            case 'notes':
                return '📄';
            case 'book':
                return '📚';
            case 'syllabus':
                return '📋';
            default:
                return '📄';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Header */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                                <User className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {user.name}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${user.role === 'admin'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                : user.role === 'moderator'
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                }`}>
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => navigate('/contribute')}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Add Resource
                            </button>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('resources')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'resources'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                                }`}
                        >
                            <BookOpen className="w-4 h-4 inline mr-2" />
                            My Resources ({userResources.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'settings'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                                }`}
                        >
                            <Settings className="w-4 h-4 inline mr-2" />
                            Settings
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === 'resources' && (
                    <div>
                        {isLoading ? (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        ) : userResources.length === 0 ? (
                            <div className="text-center py-12">
                                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No resources yet
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    You haven't contributed any resources yet. Start sharing with the community!
                                </p>
                                <button
                                    onClick={() => navigate('/contribute')}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Add Your First Resource
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {userResources.map((resource) => (
                                    <div
                                        key={resource._id}
                                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-2xl">{getResourceIcon(resource.type)}</span>
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {resource.title}
                                                    </h3>
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${resource.isApproved
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                                        }`}>
                                                        {resource.isApproved ? 'Approved' : 'Pending Review'}
                                                    </span>
                                                </div>

                                                {resource.description && (
                                                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                                                        {resource.description}
                                                    </p>
                                                )}

                                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                    <span>Type: {resource.type}</span>
                                                    {resource.provider && (
                                                        <span>Provider: {resource.provider}</span>
                                                    )}
                                                    {resource.qualityScore && (
                                                        <span>Quality: {resource.qualityScore}/100</span>
                                                    )}
                                                    <span>Added: {new Date(resource.createdAt).toLocaleDateString()}</span>
                                                </div>

                                                {resource.topics && resource.topics.length > 0 && (
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {resource.topics.map((topic: string, index: number) => (
                                                            <span
                                                                key={index}
                                                                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                                                            >
                                                                {topic}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <a
                                                href={resource.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
                                            >
                                                View Resource
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                            Account Settings
                        </h2>

                        <div className="space-y-6">
                            {/* Account Information */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                    Account Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={user.name}
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={user.email}
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    Contact an administrator to update your account information.
                                </p>
                            </div>

                            {/* Statistics */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                    Your Statistics
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {userResources.length}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Resources Contributed
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            {userResources.filter(r => r.isApproved).length}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Approved Resources
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                            {userResources.filter(r => !r.isApproved).length}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Pending Review
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">
                                    Danger Zone
                                </h3>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Logout from Account
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
