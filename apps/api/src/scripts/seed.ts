import mongoose from 'mongoose';
import { Resource } from '../features/resources/resource.model.js';
// Add imports for Subject, Branch, Program models as needed

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/studyarchive';

async function seed() {
    await mongoose.connect(MONGO_URI);

    // Branches
    const branches = [
        { name: 'CSE' }, { name: 'ECE' }, { name: 'ME' }, { name: 'CE' }, { name: 'EE' }
    ];
    // Programs
    const programs = [
        { name: 'BTECH', duration: 4 },
        { name: 'MTECH', duration: 2 }
    ];
    // Years & Semesters
    const years = [1, 2, 3, 4];
    const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

    // Example subjects
    const subjects = [
        { code: 'CS201', name: 'DSA', credits: 4, branch: 'CSE', year: 2, semester: 3 },
        { code: 'CS202', name: 'DBMS', credits: 4, branch: 'CSE', year: 2, semester: 4 },
        { code: 'CS203', name: 'OS', credits: 4, branch: 'CSE', year: 3, semester: 5 },
        { code: 'CS204', name: 'CN', credits: 4, branch: 'CSE', year: 3, semester: 6 },
        { code: 'CS205', name: 'TOC', credits: 4, branch: 'CSE', year: 2, semester: 4 },
        { code: 'MA301', name: 'M3', credits: 3, branch: 'CSE', year: 2, semester: 3 },
        { code: 'EC301', name: 'Signals & Systems', credits: 4, branch: 'ECE', year: 2, semester: 3 }
    ];

    // Resources
    const resources = [
        {
            type: 'syllabus',
            title: 'DSA Syllabus PDF',
            url: 'https://example.com/dsa-syllabus.pdf',
            provider: 'University',
            subjectRef: null, // to be set after subject insert
            tags: ['syllabus', 'pdf'],
            isApproved: true,
            qualityScore: 90
        },
        {
            type: 'lecture',
            title: 'DSA NPTEL Lecture',
            url: 'https://nptel.ac.in/dsa',
            provider: 'NPTEL',
            subjectRef: null,
            tags: ['lecture', 'video'],
            isApproved: true,
            qualityScore: 85
        },
        {
            type: 'lecture',
            title: 'DBMS Gate Smashers',
            url: 'https://youtube.com/gatesmashers-dbms',
            provider: 'Gate Smashers',
            subjectRef: null,
            tags: ['lecture', 'video'],
            isApproved: false,
            qualityScore: 80
        },
        {
            type: 'notes',
            title: 'OS Notes (GDrive)',
            url: 'https://drive.google.com/os-notes',
            provider: 'Student',
            subjectRef: null,
            tags: ['notes', 'gdrive'],
            isApproved: true,
            qualityScore: 75
        },
        {
            type: 'book',
            title: 'TOC Book',
            url: 'https://amazon.com/toc-book',
            provider: 'Publisher',
            subjectRef: null,
            tags: ['book', 'isbn'],
            isApproved: false,
            qualityScore: 70
        }
    ];

    // TODO: Insert branches, programs, years, semesters, subjects, and link resources
    // Example: const insertedSubjects = await Subject.insertMany(subjects);
    // resources.forEach(r => r.subjectRef = insertedSubjects.find(s => s.name === ...)?._id);
    // await Resource.insertMany(resources);

    await mongoose.disconnect();
    console.log('Seed complete');
}

seed().catch(console.error);
