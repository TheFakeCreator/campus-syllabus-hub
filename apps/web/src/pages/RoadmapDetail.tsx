import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, GraduationCap, ChevronLeft, CheckCircle2, Star, ExternalLink, User, Calendar } from 'lucide-react';
import { getRoadmapById } from '../lib/roadmaps';
import type { RoadmapDTO } from '../types/api';

const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

const typeColors = {
    midsem: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    endsem: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    practical: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    general: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
};

export default function RoadmapDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [roadmap, setRoadmap] = useState<RoadmapDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (id) {
            fetchRoadmap();
            // Load completed steps from localStorage
            const saved = localStorage.getItem(`roadmap-progress-${id}`);
            if (saved) {
                setCompletedSteps(new Set(JSON.parse(saved)));
            }
        }
    }, [id]);

    const fetchRoadmap = async () => {
        if (!id) return;

        try {
            setLoading(true);
            const data = await getRoadmapById(id);
            setRoadmap(data);
        } catch (err) {
            console.error('Failed to fetch roadmap:', err);
            setError('Failed to load roadmap');
        } finally {
            setLoading(false);
        }
    };

    const toggleStepCompletion = (stepId: string) => {
        const newCompleted = new Set(completedSteps);
        if (newCompleted.has(stepId)) {
            newCompleted.delete(stepId);
        } else {
            newCompleted.add(stepId);
        }
        setCompletedSteps(newCompleted);

        // Save to localStorage
        if (id) {
            localStorage.setItem(`roadmap-progress-${id}`, JSON.stringify(Array.from(newCompleted)));
        }
    };

    const getProgressPercentage = () => {
        if (!roadmap || roadmap.steps.length === 0) return 0;
        return Math.round((completedSteps.size / roadmap.steps.length) * 100);
    };

    const getCompletedHours = () => {
        if (!roadmap) return 0;
        return roadmap.steps
            .filter(step => completedSteps.has(step._id))
            .reduce((total, step) => total + step.estimatedHours, 0);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (error || !roadmap) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-800 dark:text-red-200">{error || 'Roadmap not found'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
            >
                <ChevronLeft className="h-5 w-5" />
                Back
            </button>

            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeColors[roadmap.type]}`}>
                                {roadmap.type.charAt(0).toUpperCase() + roadmap.type.slice(1)}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[roadmap.difficulty]}`}>
                                {roadmap.difficulty.charAt(0).toUpperCase() + roadmap.difficulty.slice(1)}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {roadmap.title}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {roadmap.description}
                        </p>
                    </div>
                </div>

                {/* Subject Info */}
                <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                        <strong>{roadmap.subjectRef.code}</strong> - {roadmap.subjectRef.name}
                    </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {getProgressPercentage()}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Progress</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {getCompletedHours()}h
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Completed</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {roadmap.totalEstimatedHours}h
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Total Time</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                            {roadmap.steps.length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Steps</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Overall Progress</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {completedSteps.size}/{roadmap.steps.length} steps
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getProgressPercentage()}%` }}
                        ></div>
                    </div>
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>Created by {roadmap.createdBy.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(roadmap.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Tags */}
                {roadmap.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {roadmap.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Steps */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Learning Steps
                </h2>

                {roadmap.steps
                    .sort((a, b) => a.order - b.order)
                    .map((step, index) => {
                        const isCompleted = completedSteps.has(step._id);
                        const canStart = index === 0 || completedSteps.has(roadmap.steps[index - 1]._id);

                        return (
                            <div key={step._id} className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 transition-all duration-200 ${isCompleted
                                    ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10'
                                    : canStart
                                        ? 'border-blue-200 dark:border-blue-800'
                                        : 'border-gray-200 dark:border-gray-700 opacity-60'
                                }`}>
                                <div className="p-6">
                                    {/* Step Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start gap-4 flex-1">
                                            <button
                                                onClick={() => toggleStepCompletion(step._id)}
                                                disabled={!canStart}
                                                className={`mt-1 p-1 rounded-full transition-colors ${isCompleted
                                                        ? 'text-green-600 hover:text-green-700'
                                                        : canStart
                                                            ? 'text-gray-400 hover:text-blue-600'
                                                            : 'text-gray-300 cursor-not-allowed'
                                                    }`}
                                            >
                                                <CheckCircle2 className={`h-6 w-6 ${isCompleted ? 'fill-current' : ''}`} />
                                            </button>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm font-medium">
                                                        Step {step.order}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{step.estimatedHours}h</span>
                                                    </div>
                                                </div>
                                                <h3 className={`text-xl font-semibold mb-2 ${isCompleted
                                                        ? 'text-green-800 dark:text-green-200 line-through'
                                                        : 'text-gray-900 dark:text-white'
                                                    }`}>
                                                    {step.title}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Prerequisites */}
                                    {step.prerequisites && step.prerequisites.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prerequisites:</h4>
                                            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                                                {step.prerequisites.map((prereq, idx) => (
                                                    <li key={idx}>{prereq}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Resources */}
                                    {step.resources && step.resources.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Resources:</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {step.resources.map((resource) => (
                                                    <div key={resource._id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${resource.type === 'lecture' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                                                            resource.type === 'notes' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                                                resource.type === 'book' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                                                                                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                                                                        }`}>
                                                                        {resource.type}
                                                                    </span>
                                                                    {resource.qualityScore > 0 && (
                                                                        <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
                                                                            <Star className="h-3 w-3 fill-current" />
                                                                            <span>{resource.qualityScore}/100</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <h5 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                                                                    {resource.title}
                                                                </h5>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                    by {resource.provider}
                                                                </p>
                                                            </div>
                                                            <a
                                                                href={resource.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="ml-2 p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                            >
                                                                <ExternalLink className="h-4 w-4" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
                <Link
                    to="/roadmaps"
                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                    Browse More Roadmaps
                </Link>
                {getProgressPercentage() === 100 && (
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-6 py-3 rounded-lg">
                        🎉 Congratulations! You've completed this roadmap!
                    </div>
                )}
            </div>
        </div>
    );
}
