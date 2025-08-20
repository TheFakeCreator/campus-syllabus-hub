import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../lib/api.ts';
import { useAuthStore } from '../store/auth.ts';
import PrerequisiteManager from '../components/PrerequisiteManager.tsx';
import type { Branch, Subject, Resource, Prerequisite } from '../types/api.ts';

const Contribute = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [branches, setBranches] = useState<Branch[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [existingResources, setExistingResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    // Form states
    const [formData, setFormData] = useState({
        type: '',
        title: '',
        url: '',
        description: '',
        provider: '',
        branch: '',
        semester: '',
        subject: '',
        topics: '',
        prerequisites: [] as Prerequisite[],
    });

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login?redirect=/contribute');
        }
    }, [isAuthenticated, navigate]);

    // Fetch branches on mount
    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await api.get('/catalog/branches');
                setBranches(response.data);
            } catch (error) {
                console.error('Failed to fetch branches:', error);
            }
        };
        fetchBranches();
    }, []);

    // Fetch subjects when branch and semester change
    useEffect(() => {
        const fetchSubjects = async () => {
            if (!formData.branch || !formData.semester) {
                setSubjects([]);
                return;
            }
            try {
                const response = await api.get(`/catalog/${formData.branch}/semesters/${formData.semester}/subjects`);
                setSubjects(response.data);
            } catch (error) {
                console.error('Failed to fetch subjects:', error);
                setSubjects([]);
            }
        };
        fetchSubjects();
    }, [formData.branch, formData.semester]);

    // Fetch existing resources for prerequisite selection
    useEffect(() => {
        const fetchExistingResources = async () => {
            if (!formData.subject) {
                setExistingResources([]);
                return;
            }
            try {
                const response = await api.get(`/subjects/${formData.subject}/resources`);
                setExistingResources(response.data.resources || []);
            } catch (error) {
                console.error('Failed to fetch existing resources:', error);
                setExistingResources([]);
            }
        };
        fetchExistingResources();
    }, [formData.subject]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Reset dependent fields
        if (name === 'branch') {
            setFormData(prev => ({ ...prev, semester: '', subject: '' }));
        }
        if (name === 'semester') {
            setFormData(prev => ({ ...prev, subject: '' }));
        }
    };

    const handlePrerequisitesChange = (prerequisites: Prerequisite[]) => {
        setFormData(prev => ({
            ...prev,
            prerequisites
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Find subject ID
            const selectedSubject = subjects.find((s: Subject) => s.code === formData.subject);
            if (!selectedSubject) {
                throw new Error('Please select a valid subject');
            }

            // Prepare data
            const resourceData = {
                type: formData.type,
                title: formData.title,
                url: formData.url,
                description: formData.description || undefined,
                provider: formData.provider || undefined,
                subjectRef: selectedSubject._id,
                topics: formData.topics ? formData.topics.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
                prerequisites: formData.prerequisites,
            };

            await api.post('/resources', resourceData);
            setSuccess(true);

            // Reset form
            setFormData({
                type: '',
                title: '',
                url: '',
                description: '',
                provider: '',
                branch: '',
                semester: '',
                subject: '',
                topics: '',
                prerequisites: [],
            });

            // Redirect after delay
            setTimeout(() => {
                navigate('/search');
            }, 2000);

        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to add resource');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) {
        return null; // Will redirect
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Resource Added Successfully!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Thank you for contributing to the community. Your resource is now under review.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Redirecting to search page...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                            <Upload className="w-6 h-6 mr-3 text-blue-600" />
                            Contribute a Resource
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Help your fellow students by sharing educational resources
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {error && (
                            <div className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                                <span className="text-red-700 dark:text-red-400">{error}</span>
                            </div>
                        )}

                        {/* Resource Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Resource Type *
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="">Select resource type</option>
                                <option value="syllabus">Syllabus</option>
                                <option value="lecture">Lecture Video</option>
                                <option value="notes">Notes</option>
                                <option value="book">Book/Reference</option>
                            </select>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter a descriptive title"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>

                        {/* URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                URL *
                            </label>
                            <input
                                type="url"
                                name="url"
                                value={formData.url}
                                onChange={handleInputChange}
                                required
                                placeholder="https://example.com/resource"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>

                        {/* Branch and Semester */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Branch *
                                </label>
                                <select
                                    name="branch"
                                    value={formData.branch}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="">Select branch</option>
                                    {branches.map((branch: Branch) => (
                                        <option key={branch._id} value={branch.code}>
                                            {branch.code} - {branch.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Semester *
                                </label>
                                <select
                                    name="semester"
                                    value={formData.semester}
                                    onChange={handleInputChange}
                                    required
                                    disabled={!formData.branch}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                                >
                                    <option value="">Select semester</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                        <option key={sem} value={sem.toString()}>
                                            Semester {sem}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Subject *
                            </label>
                            <select
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                required
                                disabled={!formData.branch || !formData.semester}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                            >
                                <option value="">Select subject</option>
                                {subjects.map((subject: Subject) => (
                                    <option key={subject._id} value={subject.code}>
                                        {subject.code} - {subject.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="Brief description of the resource content"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>

                        {/* Provider */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Provider/Author
                            </label>
                            <input
                                type="text"
                                name="provider"
                                value={formData.provider}
                                onChange={handleInputChange}
                                placeholder="YouTube channel, author, institution, etc."
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>

                        {/* Topics */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Topics (comma-separated)
                            </label>
                            <input
                                type="text"
                                name="topics"
                                value={formData.topics}
                                onChange={handleInputChange}
                                placeholder="machine learning, neural networks, deep learning"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Enter topics covered in this resource, separated by commas
                            </p>
                        </div>

                        {/* Prerequisites */}
                        <PrerequisiteManager
                            prerequisites={formData.prerequisites}
                            onChange={handlePrerequisitesChange}
                            existingResources={existingResources}
                        />

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Adding Resource...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Add Resource
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Guidelines */}
                <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4">
                        Contribution Guidelines
                    </h3>
                    <ul className="space-y-2 text-blue-800 dark:text-blue-300">
                        <li>• Ensure the resource is educational and relevant to the selected subject</li>
                        <li>• Provide accurate and descriptive titles</li>
                        <li>• Include proper descriptions to help others understand the content</li>
                        <li>• Add prerequisites to help students understand what they need to know first</li>
                        <li>• Only submit resources you have permission to share</li>
                        <li>• Check that the URL is accessible and working</li>
                        <li>• All submissions are reviewed before being published</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Contribute;
