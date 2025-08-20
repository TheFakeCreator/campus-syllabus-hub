import React, { useState } from 'react';
import { Settings, Database, Users, Shield, Bell, Palette, Server } from 'lucide-react';

const AdminSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', name: 'General', icon: Settings },
        { id: 'database', name: 'Database', icon: Database },
        { id: 'users', name: 'User Management', icon: Users },
        { id: 'security', name: 'Security', icon: Shield },
        { id: 'notifications', name: 'Notifications', icon: Bell },
        { id: 'appearance', name: 'Appearance', icon: Palette },
        { id: 'system', name: 'System', icon: Server }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Site Configuration</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Site Name
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="Campus Syllabus Hub"
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Site Description
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="Modern syllabus and resource management platform"
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Contact Email
                                    </label>
                                    <input
                                        type="email"
                                        defaultValue="admin@campussyllabus.com"
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Default Language
                                    </label>
                                    <select className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                        <option value="en">English</option>
                                        <option value="hi">Hindi</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Content Settings</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Auto-approve resources
                                        </label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Automatically approve new resources without manual review
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Allow public roadmaps
                                        </label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Let users create public roadmaps visible to all
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Enable user registration
                                        </label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Allow new users to register accounts
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'database':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Database Status</h3>
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <Database className="h-5 w-5 text-green-400" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-green-800 dark:text-green-400">
                                            Database Connected
                                        </h3>
                                        <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                                            <p>MongoDB connection is healthy</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Database Statistics</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">--</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Documents</div>
                                </div>
                                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">--</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Database Size</div>
                                </div>
                                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">--</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Collections</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Database Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                    Export Database
                                </button>
                                <button className="w-full sm:w-auto bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 ml-0 sm:ml-3">
                                    Backup Database
                                </button>
                                <button className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 ml-0 sm:ml-3">
                                    Reset Database
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'users':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">User Permissions</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Student Permissions
                                    </label>
                                    <div className="space-y-2">
                                        <label className="flex items-center">
                                            <input type="checkbox" defaultChecked className="rounded" />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">View resources</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" className="rounded" />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Submit resources</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" defaultChecked className="rounded" />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Create roadmaps</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Moderator Permissions
                                    </label>
                                    <div className="space-y-2">
                                        <label className="flex items-center">
                                            <input type="checkbox" defaultChecked className="rounded" />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Approve resources</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" defaultChecked className="rounded" />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Edit subjects</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" defaultChecked className="rounded" />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Manage roadmaps</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Registration Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Default User Role
                                    </label>
                                    <select className="mt-1 block w-full sm:w-48 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                        <option value="student">Student</option>
                                        <option value="moderator">Moderator</option>
                                    </select>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Require email verification
                                        </label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Users must verify their email before accessing the platform
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'security':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Authentication Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        JWT Access Token TTL (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        defaultValue="15"
                                        className="mt-1 block w-full sm:w-32 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        JWT Refresh Token TTL (days)
                                    </label>
                                    <input
                                        type="number"
                                        defaultValue="7"
                                        className="mt-1 block w-full sm:w-32 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Enable rate limiting
                                        </label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Protect against brute force attacks
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Enable CORS protection
                                        </label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Restrict cross-origin requests
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Password Policy</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Minimum Password Length
                                    </label>
                                    <input
                                        type="number"
                                        defaultValue="8"
                                        className="mt-1 block w-full sm:w-32 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Require special characters
                                        </label>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Require numbers
                                        </label>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'notifications':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Email Notifications</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            New user registration
                                        </label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Notify admins when new users register
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Resource submissions
                                        </label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Notify moderators of new resource submissions
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            System alerts
                                        </label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Notify admins of system issues
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'appearance':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Theme Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Default Theme
                                    </label>
                                    <select className="mt-1 block w-full sm:w-48 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                        <option value="system">System</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Primary Color
                                    </label>
                                    <input
                                        type="color"
                                        defaultValue="#2563eb"
                                        className="mt-1 h-10 w-20 rounded border border-gray-300 dark:border-gray-600"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Enable dark mode toggle
                                        </label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Let users switch between light and dark themes
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'system':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">System Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Version</div>
                                    <div className="text-lg font-semibold text-gray-900 dark:text-white">v1.0.0</div>
                                </div>
                                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Environment</div>
                                    <div className="text-lg font-semibold text-gray-900 dark:text-white">Development</div>
                                </div>
                                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Uptime</div>
                                    <div className="text-lg font-semibold text-gray-900 dark:text-white">--</div>
                                </div>
                                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Memory Usage</div>
                                    <div className="text-lg font-semibold text-gray-900 dark:text-white">--</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">System Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                    Clear Cache
                                </button>
                                <button className="w-full sm:w-auto bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 ml-0 sm:ml-3">
                                    Generate Logs
                                </button>
                                <button className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 ml-0 sm:ml-3">
                                    Restart Server
                                </button>
                            </div>
                        </div>
                    </div>
                );

            default:
                return <div>Select a tab to view settings</div>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{tab.name}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-6">
                    {renderTabContent()}
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex justify-end space-x-3">
                    <button className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">
                        Reset
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
