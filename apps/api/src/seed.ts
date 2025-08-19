import mongoose from 'mongoose';
import { connectDB } from './db/connect.js';
import { User } from './features/users/user.model.js';
import { Branch } from './features/catalog/branch.model.js';
import { Program } from './features/catalog/program.model.js';
import { Year } from './features/catalog/year.model.js';
import { Semester } from './features/catalog/semester.model.js';
import { Subject } from './features/catalog/subject.model.js';
import { Resource } from './features/resources/resource.model.js';
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
            Resource.deleteMany({})
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

        // Resources
        await Resource.insertMany([
            {
                type: 'lecture',
                title: 'NPTEL C Programming',
                url: 'https://nptel.ac.in/courses/106105085',
                description: 'Comprehensive C Programming course by NPTEL covering all fundamentals',
                provider: 'NPTEL',
                subjectRef: subjects[0]._id,
                topics: ['Basics', 'Loops', 'Functions'],
                tags: ['video', 'nptel', 'c-programming'],
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
                addedBy: adminUser._id,
                isApproved: true,
                qualityScore: 95
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
                addedBy: adminUser._id,
                isApproved: true,
                qualityScore: 100
            }
        ]);

        logger.info('Seed data inserted successfully');
        logger.info(`Admin user created: admin@campussyllabus.com / Admin@123`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        logger.error({ error }, 'Seed error');
        process.exit(1);
    }
}

seed();
