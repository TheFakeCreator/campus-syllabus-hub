import { useState } from 'react';
import { ExternalLink, Copy, Star, BookOpen, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import type { Resource } from '../types/api';

interface ResourceCardProps {
    resource: Resource;
    onCopyLink?: (link: string) => void;
    showPrerequisites?: boolean;
}

const ResourceCard = ({ resource, onCopyLink, showPrerequisites = true }: ResourceCardProps) => {
    const [showDetails, setShowDetails] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(resource.url);
            setCopySuccess(true);
            onCopyLink?.(resource.url);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (error) {
            console.error('Failed to copy link:', error);
        }
    };

    const getTypeIcon = (type: string) => {
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
                return '📂';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'lecture':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
            case 'notes':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
            case 'book':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
            case 'syllabus':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{getTypeIcon(resource.type)}</span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                                {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                            </span>
                            {resource.qualityScore > 0 && (
                                <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span className="text-xs font-medium">{resource.qualityScore}</span>
                                </div>
                            )}
                        </div>

                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight mb-2">
                            {resource.title}
                        </h3>

                        {resource.description && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                                {resource.description}
                            </p>
                        )}

                        {resource.provider && (
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                                <BookOpen className="w-4 h-4 mr-1" />
                                <span>by {resource.provider}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Topics */}
                {resource.topics && resource.topics.length > 0 && (
                    <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                            {resource.topics.slice(0, 3).map((topic, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs"
                                >
                                    {topic}
                                </span>
                            ))}
                            {resource.topics.length > 3 && (
                                <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs">
                                    +{resource.topics.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Prerequisites Preview */}
                {showPrerequisites && resource.prerequisites && resource.prerequisites.length > 0 && (
                    <div className="mb-3">
                        <div className="flex items-center text-sm text-amber-600 dark:text-amber-400">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            <span className="font-medium">
                                {resource.prerequisites.length} prerequisite{resource.prerequisites.length > 1 ? 's' : ''} required
                            </span>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Open Resource
                        </a>

                        <button
                            onClick={handleCopyLink}
                            className="inline-flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                        >
                            <Copy className="w-4 h-4 mr-1" />
                            {copySuccess ? 'Copied!' : 'Copy Link'}
                        </button>
                    </div>

                    {((resource.prerequisites && resource.prerequisites.length > 0) || (resource.topics && resource.topics.length > 3)) && (
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                            {showDetails ? (
                                <>
                                    <ChevronUp className="w-4 h-4 mr-1" />
                                    Less Details
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="w-4 h-4 mr-1" />
                                    More Details
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Expanded Details */}
                {showDetails && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        {/* All Topics */}
                        {resource.topics && resource.topics.length > 3 && (
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    All Topics Covered:
                                </h4>
                                <div className="flex flex-wrap gap-1">
                                    {resource.topics.map((topic, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs"
                                        >
                                            {topic}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Prerequisites Details */}
                        {resource.prerequisites && resource.prerequisites.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Prerequisites:
                                </h4>
                                <div className="space-y-2">
                                    {resource.prerequisites.map((prereq, index) => (
                                        <div
                                            key={index}
                                            className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h5 className="font-medium text-amber-800 dark:text-amber-200 text-sm">
                                                        {prereq.title}
                                                    </h5>
                                                    {prereq.description && (
                                                        <p className="text-amber-700 dark:text-amber-300 text-xs mt-1">
                                                            {prereq.description}
                                                        </p>
                                                    )}
                                                </div>
                                                {prereq.resourceLink && (
                                                    <a
                                                        href={prereq.resourceLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 text-xs ml-2"
                                                    >
                                                        <ExternalLink className="w-3 h-3 mr-1" />
                                                        View Resource
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResourceCard;
