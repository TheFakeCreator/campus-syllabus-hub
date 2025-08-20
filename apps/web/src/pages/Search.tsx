import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Filter } from 'lucide-react';
import api from '../lib/api.ts';
import ResourceCard from '../components/ResourceCard.tsx';
import type { ResourceWithDetails, Branch, Subject, PaginatedResponse } from '../types/api.ts';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [resources, setResources] = useState<ResourceWithDetails[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    // Filter states
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [type, setType] = useState(searchParams.get('type') || '');
    const [branch, setBranch] = useState(searchParams.get('branch') || '');
    const [semester, setSemester] = useState(searchParams.get('semester') || '');
    const [subject, setSubject] = useState(searchParams.get('subject') || '');

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

    // Fetch subjects when branch or semester changes
    useEffect(() => {
        const fetchSubjects = async () => {
            if (!branch || !semester) {
                setSubjects([]);
                return;
            }
            try {
                const response = await api.get(`/catalog/${branch}/semesters/${semester}/subjects`);
                setSubjects(response.data);
            } catch (error) {
                console.error('Failed to fetch subjects:', error);
                setSubjects([]);
            }
        };
        fetchSubjects();
    }, [branch, semester]);

    // Search resources
    const searchResources = async (page = 1) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (query) params.append('q', query);
            if (type) params.append('type', type);
            if (branch) params.append('branch', branch);
            if (semester) params.append('semester', semester);
            if (subject) params.append('subject', subject);
            params.append('page', page.toString());
            params.append('limit', '20');

            const response = await api.get<PaginatedResponse<ResourceWithDetails>>(`/resources?${params}`);
            setResources(response.data.resources || []);
            setTotalCount(response.data.pagination?.total || 0);
            setCurrentPage(page);
        } catch (error) {
            console.error('Search failed:', error);
            setResources([]);
            setTotalCount(0);
        } finally {
            setIsLoading(false);
        }
    };

    // Update URL params and search when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (type) params.set('type', type);
        if (branch) params.set('branch', branch);
        if (semester) params.set('semester', semester);
        if (subject) params.set('subject', subject);

        setSearchParams(params);
        searchResources(1);
    }, [query, type, branch, semester, subject]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Search Resources
                    </h1>

                    {/* Search Bar */}
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search for topics, subjects, or content..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                    </button>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Resource Type Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Resource Type
                                </label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="">All Types</option>
                                    <option value="lecture">Lectures</option>
                                    <option value="notes">Notes</option>
                                    <option value="book">Books</option>
                                    <option value="syllabus">Syllabus</option>
                                </select>
                            </div>

                            {/* Branch Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Branch
                                </label>
                                <select
                                    value={branch}
                                    onChange={(e) => {
                                        setBranch(e.target.value);
                                        setSemester('');
                                        setSubject('');
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="">All Branches</option>
                                    {branches.map((b) => (
                                        <option key={b._id} value={b.code}>
                                            {b.code} - {b.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Semester Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Semester
                                </label>
                                <select
                                    value={semester}
                                    onChange={(e) => {
                                        setSemester(e.target.value);
                                        setSubject('');
                                    }}
                                    disabled={!branch}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                                >
                                    <option value="">All Semesters</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                        <option key={sem} value={sem.toString()}>
                                            Semester {sem}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Subject Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Subject
                                </label>
                                <select
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    disabled={!branch || !semester}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                                >
                                    <option value="">All Subjects</option>
                                    {subjects.map((subj) => (
                                        <option key={subj._id} value={subj.code}>
                                            {subj.code} - {subj.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results */}
                <div>
                    {/* Results Count */}
                    <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                        {totalCount > 0 ? `${totalCount} results found` : 'No results found'}
                    </div>

                    {/* Loading State */}
                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Resource List */
                        <div className="space-y-4">
                            {resources.map((resource) => (
                                <ResourceCard
                                    key={resource._id}
                                    resource={resource}
                                    showPrerequisites={true}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalCount > 20 && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => searchResources(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                    Page {currentPage} of {Math.ceil(totalCount / 20)}
                                </span>
                                <button
                                    onClick={() => searchResources(currentPage + 1)}
                                    disabled={currentPage >= Math.ceil(totalCount / 20)}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;
