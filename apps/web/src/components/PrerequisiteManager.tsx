import { useState } from 'react';
import { Plus, Trash2, Link2, AlertCircle } from 'lucide-react';
import type { Prerequisite } from '../types/api';

interface PrerequisiteManagerProps {
    prerequisites: Prerequisite[];
    onChange: (prerequisites: Prerequisite[]) => void;
    existingResources?: Array<{ _id: string; title: string; url: string; type: string }>;
}

const PrerequisiteManager = ({ prerequisites, onChange, existingResources = [] }: PrerequisiteManagerProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showResourceSearch, setShowResourceSearch] = useState<number | null>(null);

    const addPrerequisite = () => {
        const newPrerequisite: Prerequisite = {
            title: '',
            description: '',
            resourceLink: ''
        };
        onChange([...prerequisites, newPrerequisite]);
    };

    const updatePrerequisite = (index: number, field: keyof Prerequisite, value: string) => {
        const updated = prerequisites.map((prereq, i) =>
            i === index ? { ...prereq, [field]: value } : prereq
        );
        onChange(updated);
    };

    const removePrerequisite = (index: number) => {
        onChange(prerequisites.filter((_, i) => i !== index));
    };

    const selectExistingResource = (index: number, resource: { title: string; url: string }) => {
        updatePrerequisite(index, 'resourceLink', resource.url);
        // Auto-fill title if empty
        if (!prerequisites[index].title) {
            updatePrerequisite(index, 'title', resource.title);
        }
        setShowResourceSearch(null);
        setSearchTerm('');
    };

    const filteredResources = existingResources.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Prerequisites
                </label>
                <button
                    type="button"
                    onClick={addPrerequisite}
                    className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Prerequisite
                </button>
            </div>

            {prerequisites.length === 0 && (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                        No prerequisites added yet. Click "Add Prerequisite" to get started.
                    </p>
                </div>
            )}

            {prerequisites.map((prerequisite, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Prerequisite #{index + 1}
                        </span>
                        <button
                            type="button"
                            onClick={() => removePrerequisite(index)}
                            className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={prerequisite.title}
                            onChange={(e) => updatePrerequisite(index, 'title', e.target.value)}
                            placeholder="e.g., Basic understanding of calculus"
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Description
                        </label>
                        <textarea
                            value={prerequisite.description || ''}
                            onChange={(e) => updatePrerequisite(index, 'description', e.target.value)}
                            placeholder="Optional description of what this prerequisite covers"
                            rows={2}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Resource Link */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                                Resource Link (Optional)
                            </label>
                            {existingResources.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setShowResourceSearch(showResourceSearch === index ? null : index)}
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                                >
                                    <Link2 className="w-3 h-3 mr-1" />
                                    Browse Resources
                                </button>
                            )}
                        </div>

                        <input
                            type="url"
                            value={prerequisite.resourceLink || ''}
                            onChange={(e) => updatePrerequisite(index, 'resourceLink', e.target.value)}
                            placeholder="https://example.com/prerequisite-resource"
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />

                        {/* Existing Resources Search */}
                        {showResourceSearch === index && existingResources.length > 0 && (
                            <div className="mt-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search existing resources..."
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-2"
                                />

                                <div className="max-h-48 overflow-y-auto space-y-1">
                                    {filteredResources.slice(0, 10).map((resource) => (
                                        <button
                                            key={resource._id}
                                            type="button"
                                            onClick={() => selectExistingResource(index, resource)}
                                            className="w-full text-left p-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <div className="font-medium text-gray-900 dark:text-white truncate">
                                                {resource.title}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                                {resource.type} resource
                                            </div>
                                        </button>
                                    ))}

                                    {filteredResources.length === 0 && (
                                        <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                                            No resources found matching "{searchTerm}"
                                        </div>
                                    )}

                                    {filteredResources.length > 10 && (
                                        <div className="text-center py-2 text-xs text-gray-500 dark:text-gray-400">
                                            Showing first 10 results. Refine your search for more specific results.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {prerequisites.length > 0 && (
                <div className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <strong>Tip:</strong> Prerequisites help students understand what knowledge or skills they need before starting this resource.
                    You can add multiple prerequisites and optionally link to specific resources that cover them.
                </div>
            )}
        </div>
    );
};

export default PrerequisiteManager;
