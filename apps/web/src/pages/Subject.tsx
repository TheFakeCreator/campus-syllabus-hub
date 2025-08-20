import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Map, BookOpen } from 'lucide-react';
import api from '../lib/api.ts';
import { useAuthStore } from '../store/auth.ts';
import { getRoadmapsBySubject } from '../app/lib/roadmaps';
import ResourceCard from '../components/ResourceCard.tsx';
import type { ResourceWithDetails, Subject as SubjectType, RoadmapDTO } from '../types/api.ts';

const Subject = () => {
    const { branchCode, semester, subjectCode } = useParams();
    const { isAuthenticated } = useAuthStore();
    const [subject, setSubject] = useState<SubjectType | null>(null);
    const [resources, setResources] = useState<ResourceWithDetails[]>([]);
    const [roadmaps, setRoadmaps] = useState<RoadmapDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [resourceType, setResourceType] = useState<string>('all');

    useEffect(() => {
        const fetchSubjectAndResources = async () => {
            if (!branchCode || !semester || !subjectCode) return;

            setIsLoading(true);
            try {
                // Fetch subject details
                const subjectResponse = await api.get(`/catalog/${branchCode}/semesters/${semester}/subjects`);
                const foundSubject = subjectResponse.data.find((s: SubjectType) => s.code === subjectCode);
                setSubject(foundSubject || null);

                // Fetch resources for this subject
                const params = new URLSearchParams();
                params.append('subject', subjectCode);
                if (resourceType !== 'all') params.append('type', resourceType);

                const resourcesResponse = await api.get(`/resources?${params}`);
                setResources(resourcesResponse.data.resources || []);

                // Fetch roadmaps for this subject
                try {
                    const roadmapsData = await getRoadmapsBySubject(subjectCode);
                    setRoadmaps(roadmapsData);
                } catch (roadmapError) {
                    console.error('Failed to fetch roadmaps:', roadmapError);
                    setRoadmaps([]);
                }
            } catch (error) {
                console.error('Failed to fetch subject details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubjectAndResources();
    }, [branchCode, semester, subjectCode, resourceType]);

    const resourceTypes = [
        { value: 'all', label: 'All Resources' },
        { value: 'syllabus', label: 'Syllabus' },
        { value: 'lecture', label: 'Lectures' },
        { value: 'notes', label: 'Notes' },
        { value: 'book', label: 'Books' },
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
                    <Link to="/" className="hover:text-gray-700 dark:hover:text-gray-300">
                        Home
                    </Link>
                    <span>/</span>
                    <Link to="/search" className="hover:text-gray-700 dark:hover:text-gray-300">
                        Search
                    </Link>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white">
                        {branchCode} - Semester {semester} - {subjectCode}
                    </span>
                </nav>

                {/* Back Button */}
                <Link
                    to="/search"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Search
                </Link>

                {/* Subject Header */}
                {subject ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    {subject.name}
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                                    {subject.code} • {subject.credits} Credits
                                </p>

                                {subject.topics && subject.topics.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Topics Covered:
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {subject.topics.map((topic: string, index: number) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full"
                                                >
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {isAuthenticated && (
                                <Link
                                    to="/contribute"
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Resource
                                </Link>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Subject Not Found
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            The subject {subjectCode} could not be found.
                        </p>
                    </div>
                )}

                {/* Study Roadmaps Section */}
                {roadmaps.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Map className="h-5 w-5 text-blue-600" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Study Roadmaps
                                </h2>
                            </div>
                            <Link
                                to={`/roadmaps?subject=${subjectCode}`}
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                            >
                                View All
                            </Link>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                            Follow structured learning paths for this subject
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {roadmaps.slice(0, 3).map((roadmap) => (
                                <Link
                                    key={roadmap._id}
                                    to={`/roadmaps/${roadmap._id}`}
                                    className="block p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition-all"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${roadmap.type === 'midsem' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                            roadmap.type === 'endsem' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                                                roadmap.type === 'practical' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                                            }`}>
                                            {roadmap.type.charAt(0).toUpperCase() + roadmap.type.slice(1)}
                                        </span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${roadmap.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                            roadmap.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}>
                                            {roadmap.difficulty.charAt(0).toUpperCase() + roadmap.difficulty.slice(1)}
                                        </span>
                                    </div>
                                    <h3 className="font-medium text-gray-900 dark:text-white mb-1 text-sm">
                                        {roadmap.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-xs mb-2 line-clamp-2">
                                        {roadmap.description}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                        <span>{roadmap.steps.length} steps</span>
                                        <span>{roadmap.totalEstimatedHours}h</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Resource Type Filter */}
                <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                        {resourceTypes.map((type) => (
                            <button
                                key={type.value}
                                onClick={() => setResourceType(type.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${resourceType === type.value
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Resources */}
                <div className="space-y-4">
                    {resources.length === 0 ? (
                        <div className="text-center py-12">
                            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No resources found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {resourceType === 'all'
                                    ? 'There are no resources available for this subject yet.'
                                    : `There are no ${resourceType} resources available for this subject yet.`
                                }
                            </p>
                            {isAuthenticated && (
                                <Link
                                    to="/contribute"
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Be the first to contribute
                                </Link>
                            )}
                        </div>
                    ) : (
                        resources.map((resource) => (
                            <ResourceCard
                                key={resource._id}
                                resource={resource}
                                showPrerequisites={true}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Subject;
