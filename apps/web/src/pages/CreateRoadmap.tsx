import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, ChevronLeft, Save } from 'lucide-react';
import { createRoadmap } from '../app/lib/roadmaps';
import RoadmapStepPrerequisiteManager from '../components/RoadmapStepPrerequisiteManager';
import type { RoadmapStepPrerequisite } from '../types/api';

// Validation schema
const roadmapSchema = z.object({
    subjectCode: z.string().min(1, 'Subject code is required'),
    type: z.enum(['midsem', 'endsem', 'practical', 'general']),
    title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
    description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    steps: z.array(z.object({
        title: z.string().min(1, 'Step title is required'),
        description: z.string().min(1, 'Step description is required'),
        order: z.number().min(1),
        estimatedHours: z.number().min(0.5).max(100),
        prerequisites: z.array(z.object({
            title: z.string().min(1, 'Prerequisite title is required'),
            url: z.string().url().optional().or(z.literal(''))
        })),
        resources: z.array(z.any())
    })).min(1, 'At least one step is required'),
    tags: z.array(z.string()),
    isPublic: z.boolean()
});

type RoadmapFormData = z.infer<typeof roadmapSchema>;

// Sample subjects for dropdown (in real app, fetch from API)
const subjects = [
    { code: 'CS101', name: 'Programming in C' },
    { code: 'CS201', name: 'Data Structures' },
    { code: 'CS301', name: 'Algorithms' },
    { code: 'CS302', name: 'Database Management Systems' },
    { code: 'CS401', name: 'Operating Systems' },
    { code: 'EE101', name: 'Circuit Analysis' },
    { code: 'EE201', name: 'Digital Logic Design' },
    { code: 'EE301', name: 'Control Systems' },
];

export default function CreateRoadmap() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tagInput, setTagInput] = useState('');

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<RoadmapFormData>({
        resolver: zodResolver(roadmapSchema),
        defaultValues: {
            type: 'general',
            difficulty: 'intermediate',
            steps: [
                {
                    title: '',
                    description: '',
                    order: 1,
                    estimatedHours: 1,
                    prerequisites: [],
                    resources: []
                }
            ],
            tags: [],
            isPublic: true
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'steps'
    });

    const watchedSteps = watch('steps');
    const watchedTags = watch('tags');

    // Update step orders when steps change
    useEffect(() => {
        fields.forEach((_, index) => {
            setValue(`steps.${index}.order`, index + 1);
        });
    }, [fields.length, setValue]);

    const addStep = () => {
        append({
            title: '',
            description: '',
            order: fields.length + 1,
            estimatedHours: 1,
            prerequisites: [],
            resources: []
        });
    };

    const removeStep = (index: number) => {
        if (fields.length > 1) {
            remove(index);
        }
    };

    const addTag = () => {
        const tag = tagInput.trim().toLowerCase();
        if (tag && !watchedTags.includes(tag)) {
            setValue('tags', [...watchedTags, tag]);
            setTagInput('');
        }
    };

    const removeTag = (index: number) => {
        const newTags = watchedTags.filter((_, i) => i !== index);
        setValue('tags', newTags);
    };

    const updateStepPrerequisites = (stepIndex: number, prerequisites: RoadmapStepPrerequisite[]) => {
        setValue(`steps.${stepIndex}.prerequisites`, prerequisites);
    };

    const onSubmit = async (data: RoadmapFormData) => {
        try {
            setLoading(true);
            setError(null);

            const roadmap = await createRoadmap(data);
            navigate(`/roadmaps/${roadmap._id}`);
        } catch (err: any) {
            console.error('Failed to create roadmap:', err);
            setError(err.response?.data?.message || 'Failed to create roadmap');
        } finally {
            setLoading(false);
        }
    };

    const getTotalEstimatedHours = () => {
        return watchedSteps.reduce((total, step) => total + (step.estimatedHours || 0), 0);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Back Button */}
            <Link
                to="/roadmaps"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
            >
                <ChevronLeft className="h-5 w-5" />
                Back to Roadmaps
            </Link>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Create Study Roadmap
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Create a structured learning path to help students prepare for exams and understand subjects better.
                </p>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                    <p className="text-red-800 dark:text-red-200">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Information */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Basic Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Subject */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Subject *
                            </label>
                            <select
                                {...register('subjectCode')}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
                            >
                                <option value="">Select a subject</option>
                                {subjects.map((subject) => (
                                    <option key={subject.code} value={subject.code}>
                                        {subject.code} - {subject.name}
                                    </option>
                                ))}
                            </select>
                            {errors.subjectCode && (
                                <p className="text-red-500 text-sm mt-1">{errors.subjectCode.message}</p>
                            )}
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Type *
                            </label>
                            <select
                                {...register('type')}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
                            >
                                <option value="general">General Study</option>
                                <option value="midsem">Midsem Preparation</option>
                                <option value="endsem">Endsem Preparation</option>
                                <option value="practical">Practical/Lab</option>
                            </select>
                        </div>

                        {/* Title */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                {...register('title')}
                                placeholder="e.g., Complete Data Structures Preparation for Midsem"
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Description *
                            </label>
                            <textarea
                                {...register('description')}
                                rows={3}
                                placeholder="Describe what this roadmap covers and who it's for..."
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                            )}
                        </div>

                        {/* Difficulty */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Difficulty *
                            </label>
                            <select
                                {...register('difficulty')}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>

                        {/* Total Estimated Hours (calculated) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Total Estimated Hours
                            </label>
                            <div className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white">
                                {getTotalEstimatedHours()}h (auto-calculated)
                            </div>
                        </div>
                    </div>
                </div>

                {/* Steps */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Learning Steps</h2>
                        <button
                            type="button"
                            onClick={addStep}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Add Step
                        </button>
                    </div>

                    <div className="space-y-6">
                        {fields.map((field, index) => (
                            <div key={field.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        Step {index + 1}
                                    </h3>
                                    {fields.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeStep(index)}
                                            className="text-red-600 hover:text-red-700 p-1"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Step Title */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            {...register(`steps.${index}.title`)}
                                            placeholder="e.g., Learn Array Operations"
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
                                        />
                                        {errors.steps?.[index]?.title && (
                                            <p className="text-red-500 text-sm mt-1">{errors.steps[index]?.title?.message}</p>
                                        )}
                                    </div>

                                    {/* Step Description */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Description *
                                        </label>
                                        <textarea
                                            {...register(`steps.${index}.description`)}
                                            rows={2}
                                            placeholder="Describe what the student should learn in this step..."
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
                                        />
                                        {errors.steps?.[index]?.description && (
                                            <p className="text-red-500 text-sm mt-1">{errors.steps[index]?.description?.message}</p>
                                        )}
                                    </div>

                                    {/* Estimated Hours */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Estimated Hours *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.5"
                                            min="0.5"
                                            max="100"
                                            {...register(`steps.${index}.estimatedHours`, { valueAsNumber: true })}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
                                        />
                                        {errors.steps?.[index]?.estimatedHours && (
                                            <p className="text-red-500 text-sm mt-1">{errors.steps[index]?.estimatedHours?.message}</p>
                                        )}
                                    </div>

                                    {/* Prerequisites */}
                                    <div className="md:col-span-2">
                                        <RoadmapStepPrerequisiteManager
                                            prerequisites={watchedSteps[index]?.prerequisites || []}
                                            onChange={(prerequisites) => updateStepPrerequisites(index, prerequisites)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tags */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Tags</h2>

                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            placeholder="Add tags (e.g., arrays, sorting, midsem)"
                            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
                        />
                        <button
                            type="button"
                            onClick={addTag}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Add
                        </button>
                    </div>

                    {watchedTags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {watchedTags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                                >
                                    #{tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(index)}
                                        className="text-blue-600 hover:text-blue-800 ml-1"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Settings</h2>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isPublic"
                            {...register('isPublic')}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="isPublic" className="text-gray-700 dark:text-gray-300">
                            Make this roadmap public (visible to all students)
                        </label>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Save className="h-5 w-5" />
                        {loading ? 'Creating...' : 'Create Roadmap'}
                    </button>

                    <Link
                        to="/roadmaps"
                        className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
