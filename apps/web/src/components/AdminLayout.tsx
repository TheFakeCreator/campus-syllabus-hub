import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import {
    LayoutDashboard,
    Users,
    FileText,
    BookOpen,
    GitBranch,
    Map,
    Settings,
    Menu,
    X,
    LogOut
} from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        // Check if user is admin
        if (!user || user.role !== 'admin') {
            navigate('/');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navigationItems = [
        {
            name: 'Dashboard',
            href: '/admin',
            icon: LayoutDashboard,
            current: location.pathname === '/admin'
        },
        {
            name: 'Users',
            href: '/admin/users',
            icon: Users,
            current: location.pathname === '/admin/users'
        },
        {
            name: 'Resources',
            href: '/admin/resources',
            icon: FileText,
            current: location.pathname === '/admin/resources'
        },
        {
            name: 'Subjects',
            href: '/admin/subjects',
            icon: BookOpen,
            current: location.pathname === '/admin/subjects'
        },
        {
            name: 'Branches',
            href: '/admin/branches',
            icon: GitBranch,
            current: location.pathname === '/admin/branches'
        },
        {
            name: 'Roadmaps',
            href: '/admin/roadmaps',
            icon: Map,
            current: location.pathname === '/admin/roadmaps'
        },
        {
            name: 'Settings',
            href: '/admin/settings',
            icon: Settings,
            current: location.pathname === '/admin/settings'
        }
    ];

    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className="h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                <div className="relative flex w-64 h-full flex-col bg-white dark:bg-gray-800 shadow-xl">
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                            type="button"
                            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="h-6 w-6 text-white" />
                        </button>
                    </div>
                    <div className="flex h-0 flex-1 flex-col overflow-y-auto pt-5 pb-4">
                        <div className="flex flex-shrink-0 items-center px-4">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
                        </div>
                        <nav className="mt-5 flex-1 space-y-1 px-2">
                            {navigationItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.name}
                                        onClick={() => {
                                            navigate(item.href);
                                            setSidebarOpen(false);
                                        }}
                                        className={`${item.current
                                                ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                                            } group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium`}
                                    >
                                        <Icon className="mr-3 h-5 w-5" />
                                        {item.name}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                    <div className="flex flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-center">
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{user.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="ml-auto flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
                <div className="flex flex-1 flex-col min-h-0 bg-white dark:bg-gray-800 shadow">
                    <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                        <div className="flex flex-shrink-0 items-center px-4">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
                        </div>
                        <nav className="mt-5 flex-1 space-y-1 px-2">
                            {navigationItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.name}
                                        onClick={() => navigate(item.href)}
                                        className={`${item.current
                                                ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                                            } group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium`}
                                    >
                                        <Icon className="mr-3 h-5 w-5" />
                                        {item.name}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                    <div className="flex flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-center">
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{user.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="ml-auto flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-1 flex-col lg:pl-64">
                {/* Top bar */}
                <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 lg:hidden">
                    <div className="flex h-16 justify-between">
                        <button
                            type="button"
                            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <div className="flex items-center pr-4">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{user.name}</span>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="py-6">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
