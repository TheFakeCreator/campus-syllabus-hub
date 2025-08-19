import { BookOpen, Github } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Logo and description */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                                Campus Syllabus Hub
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Find syllabus, lectures, notes, and book references for your academic journey.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="/search" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm">
                                    Search
                                </a>
                            </li>
                            <li>
                                <a href="/contribute" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm">
                                    Contribute
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                            Resources
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <span className="text-gray-600 dark:text-gray-400 text-sm">NPTEL</span>
                            </li>
                            <li>
                                <span className="text-gray-600 dark:text-gray-400 text-sm">Gate Smashers</span>
                            </li>
                            <li>
                                <span className="text-gray-600 dark:text-gray-400 text-sm">GeeksforGeeks</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            © 2025 Campus Syllabus Hub. Built for students, by students.
                        </p>
                        <div className="flex items-center space-x-4 mt-4 md:mt-0">
                            <a
                                href="https://github.com"
                                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
