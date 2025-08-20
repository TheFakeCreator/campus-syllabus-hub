import mongoose from 'mongoose';
import { connectDB } from './db/connect.js';
import { User } from './features/users/user.model.js';
import { Branch } from './features/catalog/branch.model.js';
import { Program } from './features/catalog/program.model.js';
import { Year } from './features/catalog/year.model.js';
import { Semester } from './features/catalog/semester.model.js';
import { Subject } from './features/catalog/subject.model.js';
import { Resource } from './features/resources/resource.model.js';
import { Roadmap } from './features/roadmaps/roadmap.model.js';
import { logger } from './utils/logger.js';

async function seed() {
    try {
        logger.info('Starting database seeding...');
        await connectDB();

        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            Branch.deleteMany({}),
            Program.deleteMany({}),
            Year.deleteMany({}),
            Semester.deleteMany({}),
            Subject.deleteMany({}),
            Resource.deleteMany({}),
            Roadmap.deleteMany({})
        ]);

        // Create test users
        const adminUser = await User.create({
            name: 'Dr. Admin Kumar',
            email: 'admin@campussyllabus.com',
            passwordHash: 'Admin@123',
            role: 'admin'
        });

        const moderatorUser = await User.create({
            name: 'Prof. Rajesh Sharma',
            email: 'moderator@campussyllabus.com',
            passwordHash: 'Moderator@123',
            role: 'moderator'
        });

        const studentUser = await User.create({
            name: 'Arjun Patel',
            email: 'student@campussyllabus.com',
            passwordHash: 'Student@123',
            role: 'student'
        });

        // Branches - Indian Engineering Colleges
        const branches = await Branch.insertMany([
            { code: 'CSE', name: 'Computer Science & Engineering' },
            { code: 'ECE', name: 'Electronics & Communication Engineering' },
            { code: 'ME', name: 'Mechanical Engineering' },
            { code: 'CE', name: 'Civil Engineering' },
            { code: 'EE', name: 'Electrical Engineering' },
            { code: 'IT', name: 'Information Technology' },
            { code: 'CHE', name: 'Chemical Engineering' },
            { code: 'AE', name: 'Aerospace Engineering' }
        ]);

        // Programs
        const programs = await Program.insertMany([
            { code: 'BTECH', name: 'Bachelor of Technology', branchRef: branches[0]._id, durationYears: 4 },
            { code: 'MTECH', name: 'Master of Technology', branchRef: branches[0]._id, durationYears: 2 },
        ]);

        // Years
        const years = await Year.insertMany([
            { year: 1, programRef: programs[0]._id },
            { year: 2, programRef: programs[0]._id },
            { year: 3, programRef: programs[0]._id },
            { year: 4, programRef: programs[0]._id },
        ]);

        // Semesters
        const semesters = await Semester.insertMany([
            { number: 1, yearRef: years[0]._id },
            { number: 2, yearRef: years[0]._id },
            { number: 3, yearRef: years[1]._id },
            { number: 4, yearRef: years[1]._id },
            { number: 5, yearRef: years[2]._id },
            { number: 6, yearRef: years[2]._id },
            { number: 7, yearRef: years[3]._id },
            { number: 8, yearRef: years[3]._id },
        ]);

        // Subjects
        const subjects = await Subject.insertMany([
            { code: 'CS101', name: 'Programming in C', branchRef: branches[0]._id, semesterRef: semesters[0]._id, credits: 4, topics: ['Basics', 'Loops', 'Functions'] },
            { code: 'CS102', name: 'Data Structures', branchRef: branches[0]._id, semesterRef: semesters[2]._id, credits: 4, topics: ['Arrays', 'Linked Lists', 'Trees'] },
            { code: 'CS201', name: 'Algorithms', branchRef: branches[0]._id, semesterRef: semesters[3]._id, credits: 4, topics: ['Sorting', 'Searching', 'Graph Algorithms'] },
            { code: 'ECE101', name: 'Basic Electronics', branchRef: branches[1]._id, semesterRef: semesters[0]._id, credits: 4, topics: ['Diodes', 'Transistors'] },
            { code: 'ME101', name: 'Engineering Mechanics', branchRef: branches[2]._id, semesterRef: semesters[0]._id, credits: 4, topics: ['Statics', 'Dynamics'] },
        ]);

        // Resources with prerequisites
        const resources = await Resource.insertMany([
            {
                type: 'lecture',
                title: 'NPTEL C Programming',
                url: 'https://nptel.ac.in/courses/106105085',
                description: 'Comprehensive C Programming course by NPTEL covering all fundamentals',
                provider: 'NPTEL',
                subjectRef: subjects[0]._id,
                topics: ['Basics', 'Loops', 'Functions'],
                tags: ['video', 'nptel', 'c-programming'],
                prerequisites: [
                    {
                        title: 'Basic Computer Knowledge',
                        description: 'Understanding of computer basics and operating systems'
                    }
                ],
                addedBy: adminUser._id,
                isApproved: true,
                qualityScore: 90
            },
            {
                type: 'lecture',
                title: 'Gate Smashers Data Structures',
                url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiEwaANNt3OqJPVIxwp2ebiT',
                description: 'Complete Data Structures playlist by Gate Smashers',
                provider: 'Gate Smashers',
                subjectRef: subjects[1]._id,
                topics: ['Arrays', 'Linked Lists', 'Trees'],
                tags: ['video', 'gate-smashers', 'data-structures'],
                prerequisites: [
                    {
                        title: 'Programming in C',
                        description: 'Basic understanding of C programming language',
                        resourceLink: 'https://nptel.ac.in/courses/106105085'
                    },
                    {
                        title: 'Mathematical Foundation',
                        description: 'Basic mathematics and logical thinking'
                    }
                ],
                addedBy: adminUser._id,
                isApproved: true,
                qualityScore: 85
            },
            {
                type: 'notes',
                title: 'GeeksforGeeks Data Structures',
                url: 'https://www.geeksforgeeks.org/data-structures/',
                description: 'Comprehensive notes and tutorials on Data Structures',
                provider: 'GeeksforGeeks',
                subjectRef: subjects[1]._id,
                topics: ['Trees', 'Graphs', 'Hash Tables'],
                tags: ['notes', 'gfg', 'tutorial'],
                prerequisites: [
                    {
                        title: 'Basic Programming',
                        description: 'Knowledge of any programming language (C/C++/Java)'
                    }
                ],
                addedBy: adminUser._id,
                isApproved: true,
                qualityScore: 80
            },
            {
                type: 'book',
                title: 'Let Us C by Yashavant Kanetkar',
                url: 'https://www.amazon.in/Let-Us-C-Yashavant-Kanetkar/dp/9388511396',
                description: 'Popular C programming book for beginners',
                provider: 'BPB Publications',
                subjectRef: subjects[0]._id,
                topics: ['Basics', 'Pointers', 'Functions'],
                tags: ['book', 'c-programming', 'beginner'],
                prerequisites: [],
                addedBy: adminUser._id,
                isApproved: true,
                qualityScore: 95
            },
            {
                type: 'lecture',
                title: 'Abdul Bari Algorithms',
                url: 'https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O',
                description: 'Complete Algorithms course by Abdul Bari covering sorting, searching, and advanced algorithms',
                provider: 'Abdul Bari',
                subjectRef: subjects[2]._id,
                topics: ['Sorting', 'Searching', 'Graph Algorithms', 'Dynamic Programming'],
                tags: ['video', 'algorithms', 'abdul-bari'],
                prerequisites: [
                    {
                        title: 'Data Structures',
                        description: 'Strong understanding of data structures like arrays, linked lists, trees',
                        resourceLink: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiEwaANNt3OqJPVIxwp2ebiT'
                    },
                    {
                        title: 'Mathematical Analysis',
                        description: 'Basic understanding of time complexity and mathematical proofs'
                    }
                ],
                addedBy: moderatorUser._id,
                isApproved: true,
                qualityScore: 92
            },
            {
                type: 'syllabus',
                title: 'CS101 Official Syllabus',
                url: 'https://example.com/cs101-syllabus.pdf',
                description: 'Official syllabus for Programming in C course',
                provider: 'University',
                subjectRef: subjects[0]._id,
                topics: ['Course Outline', 'Learning Objectives'],
                tags: ['syllabus', 'official'],
                prerequisites: [],
                addedBy: adminUser._id,
                isApproved: true,
                qualityScore: 100
            }
        ]);

        // Roadmaps with step prerequisites
        await Roadmap.insertMany([
            {
                subjectRef: subjects[0]._id, // CS101 - Programming in C
                type: 'general',
                title: 'Complete C Programming Mastery',
                description: 'A comprehensive roadmap to master C programming from basics to advanced concepts',
                totalEstimatedHours: 40,
                difficulty: 'beginner',
                steps: [
                    {
                        title: 'Setup Development Environment',
                        description: 'Install a C compiler and set up your development environment',
                        order: 1,
                        estimatedHours: 2,
                        prerequisites: [],
                        resources: [resources[0]._id], // NPTEL C Programming
                        url: 'https://code.visualstudio.com/docs/languages/cpp'
                    },
                    {
                        title: 'Learn Basic Syntax',
                        description: 'Understand variables, data types, and basic input/output',
                        order: 2,
                        estimatedHours: 8,
                        prerequisites: [
                            {
                                title: 'Development Environment Setup',
                                url: 'https://code.visualstudio.com/docs/languages/cpp'
                            }
                        ],
                        resources: [resources[0]._id, resources[3]._id], // NPTEL + Book
                    },
                    {
                        title: 'Control Structures',
                        description: 'Master loops, conditions, and decision making',
                        order: 3,
                        estimatedHours: 10,
                        prerequisites: [
                            {
                                title: 'Basic Syntax Knowledge',
                                url: 'https://www.programiz.com/c-programming/c-syntax-rules'
                            }
                        ],
                        resources: [resources[0]._id],
                    },
                    {
                        title: 'Functions and Modular Programming',
                        description: 'Learn to write reusable code with functions',
                        order: 4,
                        estimatedHours: 12,
                        prerequisites: [
                            {
                                title: 'Control Structures Mastery'
                            }
                        ],
                        resources: [resources[0]._id, resources[3]._id],
                    },
                    {
                        title: 'Pointers and Memory Management',
                        description: 'Understand pointers, dynamic memory allocation',
                        order: 5,
                        estimatedHours: 8,
                        prerequisites: [
                            {
                                title: 'Functions Understanding'
                            }
                        ],
                        resources: [resources[3]._id],
                    }
                ],
                createdBy: adminUser._id,
                isPublic: true,
                isApproved: true,
                tags: ['c-programming', 'beginner', 'complete-course']
            },
            {
                subjectRef: subjects[1]._id, // CS102 - Data Structures
                type: 'midsem',
                title: 'Data Structures for Midsem Preparation',
                description: 'Focused preparation plan for data structures midsem exam covering essential topics',
                totalEstimatedHours: 25,
                difficulty: 'intermediate',
                steps: [
                    {
                        title: 'Arrays and Basic Operations',
                        description: 'Master array operations, searching, and basic algorithms',
                        order: 1,
                        estimatedHours: 6,
                        prerequisites: [
                            {
                                title: 'C Programming Basics',
                                url: 'https://nptel.ac.in/courses/106105085'
                            }
                        ],
                        resources: [resources[1]._id, resources[2]._id], // Gate Smashers + GFG
                    },
                    {
                        title: 'Linked Lists',
                        description: 'Understand different types of linked lists and operations',
                        order: 2,
                        estimatedHours: 8,
                        prerequisites: [
                            {
                                title: 'Arrays Knowledge'
                            },
                            {
                                title: 'Pointers in C',
                                url: 'https://www.programiz.com/c-programming/c-pointers'
                            }
                        ],
                        resources: [resources[1]._id, resources[2]._id],
                    },
                    {
                        title: 'Stacks and Queues',
                        description: 'Learn stack and queue implementations and applications',
                        order: 3,
                        estimatedHours: 6,
                        prerequisites: [
                            {
                                title: 'Linked Lists Understanding'
                            }
                        ],
                        resources: [resources[1]._id, resources[2]._id],
                    },
                    {
                        title: 'Trees Fundamentals',
                        description: 'Binary trees, traversals, and basic tree operations',
                        order: 4,
                        estimatedHours: 5,
                        prerequisites: [
                            {
                                title: 'Stacks and Queues'
                            }
                        ],
                        resources: [resources[1]._id, resources[2]._id],
                    }
                ],
                createdBy: moderatorUser._id,
                isPublic: true,
                isApproved: true,
                tags: ['data-structures', 'midsem', 'exam-prep']
            },
            {
                subjectRef: subjects[2]._id, // CS201 - Algorithms
                type: 'endsem',
                title: 'Algorithms End Semester Complete Guide',
                description: 'Comprehensive preparation for algorithms end semester covering all major topics',
                totalEstimatedHours: 50,
                difficulty: 'advanced',
                steps: [
                    {
                        title: 'Sorting Algorithms',
                        description: 'Master all sorting algorithms with time complexity analysis',
                        order: 1,
                        estimatedHours: 12,
                        prerequisites: [
                            {
                                title: 'Data Structures Knowledge',
                                url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiEwaANNt3OqJPVIxwp2ebiT'
                            },
                            {
                                title: 'Time Complexity Analysis'
                            }
                        ],
                        resources: [resources[4]._id], // Abdul Bari Algorithms
                    },
                    {
                        title: 'Searching Algorithms',
                        description: 'Binary search, interpolation search, and advanced searching',
                        order: 2,
                        estimatedHours: 8,
                        prerequisites: [
                            {
                                title: 'Sorting Algorithms Mastery'
                            }
                        ],
                        resources: [resources[4]._id],
                    },
                    {
                        title: 'Graph Algorithms',
                        description: 'DFS, BFS, shortest path, and minimum spanning tree algorithms',
                        order: 3,
                        estimatedHours: 15,
                        prerequisites: [
                            {
                                title: 'Tree Data Structure',
                                url: 'https://www.geeksforgeeks.org/binary-tree-data-structure/'
                            }
                        ],
                        resources: [resources[4]._id],
                    },
                    {
                        title: 'Dynamic Programming',
                        description: 'Understand memoization, tabulation, and classic DP problems',
                        order: 4,
                        estimatedHours: 15,
                        prerequisites: [
                            {
                                title: 'Recursion Mastery'
                            },
                            {
                                title: 'Graph Algorithms Understanding'
                            }
                        ],
                        resources: [resources[4]._id],
                    }
                ],
                createdBy: adminUser._id,
                isPublic: true,
                isApproved: true,
                tags: ['algorithms', 'endsem', 'advanced', 'dynamic-programming']
            },
            {
                subjectRef: subjects[1]._id, // CS102 - Data Structures
                type: 'practical',
                title: 'Data Structures Lab Implementation Guide',
                description: 'Hands-on implementation guide for data structures lab assignments',
                totalEstimatedHours: 30,
                difficulty: 'intermediate',
                steps: [
                    {
                        title: 'Array-based Implementations',
                        description: 'Implement stack, queue, and basic operations using arrays',
                        order: 1,
                        estimatedHours: 8,
                        prerequisites: [
                            {
                                title: 'C Programming Proficiency'
                            }
                        ],
                        resources: [resources[2]._id], // GFG
                    },
                    {
                        title: 'Linked List Implementations',
                        description: 'Code various linked list types and operations',
                        order: 2,
                        estimatedHours: 10,
                        prerequisites: [
                            {
                                title: 'Array Implementations'
                            }
                        ],
                        resources: [resources[1]._id, resources[2]._id],
                    },
                    {
                        title: 'Tree Implementation and Traversals',
                        description: 'Implement binary trees with all traversal methods',
                        order: 3,
                        estimatedHours: 12,
                        prerequisites: [
                            {
                                title: 'Linked List Mastery'
                            }
                        ],
                        resources: [resources[1]._id, resources[2]._id],
                    }
                ],
                createdBy: moderatorUser._id,
                isPublic: true,
                isApproved: false, // Some pending approval
                tags: ['practical', 'lab', 'implementation', 'coding']
            }
        ]);

        logger.info('Seed data inserted successfully');
        logger.info(`Admin user created: admin@campussyllabus.com / Admin@123`);
        logger.info(`Moderator user created: moderator@campussyllabus.com / Moderator@123`);
        logger.info(`Student user created: student@campussyllabus.com / Student@123`);
        logger.info(`Created ${branches.length} branches, ${subjects.length} subjects`);
        logger.info(`Created ${resources.length} resources with prerequisites`);
        logger.info(`Created 4 roadmaps with step-wise prerequisites (1 pending approval)`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        logger.error({ error }, 'Seed error');
        process.exit(1);
    }
}

seed();
