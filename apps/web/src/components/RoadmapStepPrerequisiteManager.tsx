import { useState } from 'react';
import { Plus, Trash2, AlertCircle, Link2 } from 'lucide-react';
import type { RoadmapStepPrerequisite } from '../types/api';

interface RoadmapStepPrerequisiteManagerProps {
    prerequisites: RoadmapStepPrerequisite[];
    onChange: (prerequisites: RoadmapStepPrerequisite[]) => void;
}

const RoadmapStepPrerequisiteManager = ({
    prerequisites,
    onChange
}: RoadmapStepPrerequisiteManagerProps) => {
    const [newPrerequisite, setNewPrerequisite] = useState({ title: '', url: '' });
    const [showUrlInput, setShowUrlInput] = useState(false);

    const addPrerequisite = () => {
        const title = newPrerequisite.title.trim();
        const url = newPrerequisite.url.trim();

        if (title && !prerequisites.some(p => p.title === title)) {
            const prerequisiteObj: RoadmapStepPrerequisite = { title };
            if (url) {
                prerequisiteObj.url = url;
            }
            onChange([...prerequisites, prerequisiteObj]);
            setNewPrerequisite({ title: '', url: '' });
            setShowUrlInput(false);
        }
    };

    const removePrerequisite = (index: number) => {
        onChange(prerequisites.filter((_, i) => i !== index));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addPrerequisite();
        }
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Prerequisites for this step
            </label>

            {/* Add new prerequisite */}
            <div className="space-y-2">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newPrerequisite.title}
                        onChange={(e) => setNewPrerequisite(prev => ({ ...prev, title: e.target.value }))}
                        onKeyPress={handleKeyPress}
                        placeholder="e.g., Complete understanding of basic loops"
                        className="flex-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className="inline-flex items-center px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        <Link2 className="w-4 h-4 mr-1" />
                        URL
                    </button>
                    <button
                        type="button"
                        onClick={addPrerequisite}
                        disabled={!newPrerequisite.title.trim()}
                        className="inline-flex items-center px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                    </button>
                </div>

                {showUrlInput && (
                    <input
                        type="url"
                        value={newPrerequisite.url}
                        onChange={(e) => setNewPrerequisite(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://example.com/prerequisite-resource (optional)"
                        className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                )}
            </div>

            {/* List of prerequisites */}
            {prerequisites.length > 0 && (
                <div className="space-y-2">
                    {prerequisites.map((prerequisite, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded px-3 py-2"
                        >
                            <div className="flex-1">
                                {prerequisite.url ? (
                                    <a
                                        href={prerequisite.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-amber-800 dark:text-amber-200 hover:text-amber-900 dark:hover:text-amber-100 hover:underline flex items-center"
                                    >
                                        {prerequisite.title}
                                        <Link2 className="w-3 h-3 ml-1" />
                                    </a>
                                ) : (
                                    <span className="text-sm text-amber-800 dark:text-amber-200">
                                        {prerequisite.title}
                                    </span>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => removePrerequisite(index)}
                                className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 ml-2"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {prerequisites.length === 0 && (
                <div className="text-center py-4 bg-gray-50 dark:bg-gray-800/50 rounded border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        No prerequisites added for this step yet.
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                        Add what students should know before starting this step.
                    </p>
                </div>
            )}

            <div className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                <strong>Tip:</strong> Prerequisites help students understand what knowledge they need before starting this step.
                Be specific about concepts, skills, or previous steps that should be completed first.
            </div>
        </div>
    );
};

export default RoadmapStepPrerequisiteManager;
