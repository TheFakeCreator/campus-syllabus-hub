import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Users, Star, Map, Clock } from 'lucide-react';
import { api } from '../lib/api';
import { getRoadmaps } from '../lib/roadmaps';
import type { Branch } from '../types/api';
import type { RoadmapDTO } from '../types/api';

const Home = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [featuredRoadmaps, setFeaturedRoadmaps] = useState<RoadmapDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch branches
                const branchesResponse = await api.get('/catalog/branches');
                setBranches(branchesResponse.data);

                // Fetch featured roadmaps (first 6)
                const roadmapsResponse = await getRoadmaps({ limit: 6 });
                setFeaturedRoadmaps(roadmapsResponse?.roadmaps || []);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setFeaturedRoadmaps([]);
                setBranches([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="bg-white dark:bg-gray-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-white dark:bg-gray-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                                    <span className="block xl:inline">Find your</span>{' '}
                                    <span className="block text-blue-600 xl:inline">academic resources</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    Access syllabus, lecture videos, notes, and book references organized by branch, year, semester, and subject. Everything you need for your studies in one place.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        <Link
                                            to="/search"
                                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                                        >
                                            <Search className="w-5 h-5 mr-2" />
                                            Start Searching
                                        </Link>
                                    </div>
                                    <div className="mt-3 sm:mt-0 sm:ml-3">
                                        <Link
                                            to="/contribute"
                                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                                        >
                                            Contribute Resources
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <div className="h-56 w-full bg-gradient-to-r from-blue-500 to-purple-600 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
                        <BookOpen className="w-32 h-32 text-white opacity-20" />
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-12 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            Everything you need to succeed
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                                    <Search className="w-6 h-6" />
                                </div>
                                <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Smart Search</p>
                                <p className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                                    Find resources quickly with our intelligent search across subjects, topics, and content types.
                                </p>
                            </div>

                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                                    <Users className="w-6 h-6" />
                                </div>
                                <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Community Driven</p>
                                <p className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                                    Resources contributed and curated by students and educators from various institutions.
                                </p>
                            </div>

                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                                    <Star className="w-6 h-6" />
                                </div>
                                <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">Quality Assured</p>
                                <p className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                                    All resources are reviewed and rated to ensure high quality and relevance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Roadmaps Section */}
            <div className="bg-white dark:bg-gray-900 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center mb-10">
                        <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Study Roadmaps</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            Guided Learning Paths
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
                            Follow structured step-by-step guides to master your subjects for midsems, endsems, and practicals.
                        </p>
                    </div>

                    {featuredRoadmaps && featuredRoadmaps.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {featuredRoadmaps.map((roadmap) => (
                                <Link
                                    key={roadmap._id}
                                    to={`/roadmaps/${roadmap._id}`}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 p-6 group"
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${roadmap.type === 'midsem' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                            roadmap.type === 'endsem' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                                                roadmap.type === 'practical' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                                            }`}>
                                            {roadmap.type.charAt(0).toUpperCase() + roadmap.type.slice(1)}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${roadmap.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                            roadmap.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}>
                                            {roadmap.difficulty.charAt(0).toUpperCase() + roadmap.difficulty.slice(1)}
                                        </span>
                                    </div>

                                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {roadmap.title}
                                    </h3>

                                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                                        {roadmap.description}
                                    </p>

                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                        <span className="font-medium">{roadmap.subjectRef.code}</span>
                                        <span>•</span>
                                        <span>{roadmap.subjectRef.name}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            <span>{roadmap.totalEstimatedHours}h</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Map className="h-4 w-4" />
                                            <span>{roadmap.steps.length} steps</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="text-center">
                        <Link
                            to="/roadmaps"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors"
                        >
                            <Map className="w-5 h-5 mr-2" />
                            Explore All Roadmaps
                        </Link>
                    </div>
                </div>
            </div>

            {/* Browse by Branch Section */}
            <div className="bg-gray-50 dark:bg-gray-800 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Browse</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            Choose your branch
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
                            Select your engineering branch to access organized study materials.
                        </p>
                    </div>

                    <div className="mt-10">
                        {isLoading ? (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-24 animate-pulse"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {branches.map((branch) => (
                                    <Link
                                        key={branch._id}
                                        to={`/search?branch=${branch.code}`}
                                        className="relative group bg-white dark:bg-gray-800 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                                    >
                                        <div>
                                            <div className="text-lg font-medium text-gray-900 dark:text-white">
                                                {branch.code}
                                            </div>
                                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                {branch.name}
                                            </p>
                                        </div>
                                        <span className="absolute top-6 right-6 text-gray-300 group-hover:text-gray-400" aria-hidden="true">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
