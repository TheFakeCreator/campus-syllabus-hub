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
import { ResourceRating } from './features/ratings/rating.model.js';
import { logger } from './utils/logger.js';

async function seed() {
    try {
        logger.info('🌱 Starting comprehensive database seeding...');
        await connectDB();

        // Clear existing data
        logger.info('🧹 Clearing existing data...');
        await Promise.all([
            User.deleteMany({}),
            Branch.deleteMany({}),
            Program.deleteMany({}),
            Year.deleteMany({}),
            Semester.deleteMany({}),
            Subject.deleteMany({}),
            Resource.deleteMany({}),
            Roadmap.deleteMany({}),
            ResourceRating.deleteMany({})
        ]);

        // Create test users
        logger.info('👥 Creating test users...');
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
        logger.info('🏫 Creating branches...');
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
        logger.info('🎓 Creating programs...');
        const programs = await Program.insertMany([
            { code: 'BTECH', name: 'Bachelor of Technology', branchRef: branches[0]._id, durationYears: 4 },
            { code: 'MTECH', name: 'Master of Technology', branchRef: branches[0]._id, durationYears: 2 },
            { code: 'MCA', name: 'Master of Computer Applications', branchRef: branches[0]._id, durationYears: 3 },
            { code: 'BE', name: 'Bachelor of Engineering', branchRef: branches[0]._id, durationYears: 4 }
        ]);

        // Years for BTech (4 years)
        logger.info('📅 Creating academic years...');
        const years = await Year.insertMany([
            { year: 1, programRef: programs[0]._id },
            { year: 2, programRef: programs[0]._id },
            { year: 3, programRef: programs[0]._id },
            { year: 4, programRef: programs[0]._id },
        ]);

        // Semesters for BTech (8 semesters)
        logger.info('📚 Creating semesters...');
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

        // Comprehensive Subjects - CSE Branch
        logger.info('📖 Creating subjects...');
        const cseSubjects = await Subject.insertMany([
            // Semester 1
            { code: 'CS101', name: 'Programming in C', branchRef: branches[0]._id, semesterRef: semesters[0]._id, credits: 4, topics: ['C Basics', 'Control Structures', 'Functions', 'Arrays', 'Pointers'] },
            { code: 'MA101', name: 'Engineering Mathematics I', branchRef: branches[0]._id, semesterRef: semesters[0]._id, credits: 4, topics: ['Calculus', 'Linear Algebra', 'Differential Equations'] },
            { code: 'PH101', name: 'Engineering Physics', branchRef: branches[0]._id, semesterRef: semesters[0]._id, credits: 3, topics: ['Mechanics', 'Wave Motion', 'Thermodynamics'] },
            { code: 'EG101', name: 'Engineering Graphics', branchRef: branches[0]._id, semesterRef: semesters[0]._id, credits: 2, topics: ['Technical Drawing', 'Projections', 'CAD'] },

            // Semester 2
            { code: 'CS102', name: 'Object Oriented Programming', branchRef: branches[0]._id, semesterRef: semesters[1]._id, credits: 4, topics: ['OOP Concepts', 'Java/C++', 'Inheritance', 'Polymorphism'] },
            { code: 'MA102', name: 'Engineering Mathematics II', branchRef: branches[0]._id, semesterRef: semesters[1]._id, credits: 4, topics: ['Vector Calculus', 'Complex Analysis', 'Probability'] },
            { code: 'CH101', name: 'Engineering Chemistry', branchRef: branches[0]._id, semesterRef: semesters[1]._id, credits: 3, topics: ['Atomic Structure', 'Chemical Bonding', 'Thermochemistry'] },
            { code: 'EE201', name: 'Basic Electrical Engineering', branchRef: branches[0]._id, semesterRef: semesters[1]._id, credits: 3, topics: ['DC Circuits', 'AC Circuits', 'Electrical Machines'] },

            // Semester 3
            { code: 'CS201', name: 'Data Structures', branchRef: branches[0]._id, semesterRef: semesters[2]._id, credits: 4, topics: ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Trees', 'Graphs'] },
            { code: 'CS202', name: 'Digital Logic Design', branchRef: branches[0]._id, semesterRef: semesters[2]._id, credits: 4, topics: ['Boolean Algebra', 'Logic Gates', 'Combinational Circuits', 'Sequential Circuits'] },
            { code: 'MA201', name: 'Discrete Mathematics', branchRef: branches[0]._id, semesterRef: semesters[2]._id, credits: 4, topics: ['Set Theory', 'Logic', 'Graph Theory', 'Combinatorics'] },
            { code: 'EC201', name: 'Electronic Devices', branchRef: branches[0]._id, semesterRef: semesters[2]._id, credits: 3, topics: ['Semiconductors', 'Diodes', 'Transistors'] },

            // Semester 4
            { code: 'CS301', name: 'Algorithms', branchRef: branches[0]._id, semesterRef: semesters[3]._id, credits: 4, topics: ['Algorithm Analysis', 'Sorting', 'Searching', 'Dynamic Programming', 'Greedy Algorithms'] },
            { code: 'CS302', name: 'Computer Organization', branchRef: branches[0]._id, semesterRef: semesters[3]._id, credits: 4, topics: ['CPU Architecture', 'Memory Hierarchy', 'I/O Systems', 'Assembly Language'] },
            { code: 'CS303', name: 'Database Management Systems', branchRef: branches[0]._id, semesterRef: semesters[3]._id, credits: 4, topics: ['ER Model', 'SQL', 'Normalization', 'Transactions', 'Indexing'] },
            { code: 'MA301', name: 'Probability and Statistics', branchRef: branches[0]._id, semesterRef: semesters[3]._id, credits: 3, topics: ['Probability Distributions', 'Statistical Inference', 'Hypothesis Testing'] },

            // Semester 5
            { code: 'CS401', name: 'Operating Systems', branchRef: branches[0]._id, semesterRef: semesters[4]._id, credits: 4, topics: ['Process Management', 'Memory Management', 'File Systems', 'Deadlocks'] },
            { code: 'CS402', name: 'Computer Networks', branchRef: branches[0]._id, semesterRef: semesters[4]._id, credits: 4, topics: ['OSI Model', 'TCP/IP', 'Routing', 'Network Security'] },
            { code: 'CS403', name: 'Software Engineering', branchRef: branches[0]._id, semesterRef: semesters[4]._id, credits: 3, topics: ['SDLC', 'Requirements Engineering', 'Design Patterns', 'Testing'] },
            { code: 'CS404', name: 'Theory of Computation', branchRef: branches[0]._id, semesterRef: semesters[4]._id, credits: 4, topics: ['Automata', 'Regular Languages', 'Context-Free Grammars', 'Turing Machines'] },

            // Semester 6
            { code: 'CS501', name: 'Compiler Design', branchRef: branches[0]._id, semesterRef: semesters[5]._id, credits: 4, topics: ['Lexical Analysis', 'Syntax Analysis', 'Code Generation', 'Optimization'] },
            { code: 'CS502', name: 'Web Technologies', branchRef: branches[0]._id, semesterRef: semesters[5]._id, credits: 3, topics: ['HTML/CSS', 'JavaScript', 'React/Angular', 'Node.js', 'REST APIs'] },
            { code: 'CS503', name: 'Artificial Intelligence', branchRef: branches[0]._id, semesterRef: semesters[5]._id, credits: 4, topics: ['Search Algorithms', 'Knowledge Representation', 'Machine Learning Basics'] },
            { code: 'CS504', name: 'Computer Graphics', branchRef: branches[0]._id, semesterRef: semesters[5]._id, credits: 3, topics: ['2D/3D Graphics', 'Rendering', 'Animation'] }
        ]);

        // Add some ECE subjects too
        const eceSubjects = await Subject.insertMany([
            { code: 'ECE101', name: 'Basic Electronics', branchRef: branches[1]._id, semesterRef: semesters[0]._id, credits: 4, topics: ['Diodes', 'Transistors', 'Amplifiers'] },
            { code: 'ECE201', name: 'Digital Electronics', branchRef: branches[1]._id, semesterRef: semesters[2]._id, credits: 4, topics: ['Logic Gates', 'Flip-Flops', 'Counters'] },
            { code: 'ECE301', name: 'Signals and Systems', branchRef: branches[1]._id, semesterRef: semesters[4]._id, credits: 4, topics: ['Fourier Transform', 'Laplace Transform', 'Z-Transform'] }
        ]);

        // Add EE (Electrical Engineering) subjects
        const eeSubjects = await Subject.insertMany([
            { code: 'EE101', name: 'Circuit Analysis', branchRef: branches[4]._id, semesterRef: semesters[0]._id, credits: 4, topics: ['Ohms Law', 'Kirchhoffs Laws', 'Network Theorems', 'AC Circuits'] },
            { code: 'EE102', name: 'Electrical Machines I', branchRef: branches[4]._id, semesterRef: semesters[2]._id, credits: 4, topics: ['DC Motors', 'DC Generators', 'Transformers'] },
            { code: 'EE203', name: 'Power Systems', branchRef: branches[4]._id, semesterRef: semesters[3]._id, credits: 4, topics: ['Power Generation', 'Transmission', 'Distribution', 'Protection'] },
            { code: 'EE301', name: 'Control Systems', branchRef: branches[4]._id, semesterRef: semesters[4]._id, credits: 4, topics: ['Transfer Functions', 'Stability', 'PID Controllers', 'Root Locus'] },
            { code: 'EE302', name: 'Electrical Machines II', branchRef: branches[4]._id, semesterRef: semesters[5]._id, credits: 4, topics: ['Induction Motors', 'Synchronous Machines', 'Special Machines'] }
        ]);

        // Add ME (Mechanical Engineering) subjects
        const meSubjects = await Subject.insertMany([
            { code: 'ME101', name: 'Engineering Mechanics', branchRef: branches[2]._id, semesterRef: semesters[0]._id, credits: 4, topics: ['Statics', 'Dynamics', 'Force Systems', 'Friction'] },
            { code: 'ME201', name: 'Thermodynamics', branchRef: branches[2]._id, semesterRef: semesters[2]._id, credits: 4, topics: ['First Law', 'Second Law', 'Heat Engines', 'Refrigeration'] },
            { code: 'ME301', name: 'Fluid Mechanics', branchRef: branches[2]._id, semesterRef: semesters[4]._id, credits: 4, topics: ['Fluid Properties', 'Flow Analysis', 'Pumps', 'Compressors'] },
            { code: 'ME302', name: 'Machine Design', branchRef: branches[2]._id, semesterRef: semesters[5]._id, credits: 4, topics: ['Design Process', 'Material Selection', 'Gears', 'Bearings'] }
        ]);

        // Add CE (Civil Engineering) subjects  
        const ceSubjects = await Subject.insertMany([
            { code: 'CE101', name: 'Building Materials', branchRef: branches[3]._id, semesterRef: semesters[0]._id, credits: 4, topics: ['Concrete', 'Steel', 'Timber', 'Testing Methods'] },
            { code: 'CE201', name: 'Structural Analysis', branchRef: branches[3]._id, semesterRef: semesters[2]._id, credits: 4, topics: ['Beams', 'Frames', 'Trusses', 'Deflection'] },
            { code: 'CE301', name: 'Geotechnical Engineering', branchRef: branches[3]._id, semesterRef: semesters[4]._id, credits: 4, topics: ['Soil Properties', 'Foundation Design', 'Slope Stability'] }
        ]);

        // Comprehensive Resources with real YouTube/NPTEL links
        logger.info('🎥 Creating learning resources...');
        const resources = await Resource.insertMany([
            // Programming in C Resources
            {
                type: 'syllabus',
                title: 'Programming in C - Complete Syllabus',
                url: 'https://drive.google.com/file/d/sample-syllabus-c-programming',
                description: 'Comprehensive syllabus covering all aspects of C Programming from basics to advanced topics including practical lab exercises',
                provider: 'University Curriculum Board',
                subjectRef: cseSubjects[0]._id,
                topics: ['C Basics', 'Control Structures', 'Functions', 'Arrays', 'Pointers'],
                tags: ['syllabus', 'curriculum', 'c-programming', 'lab-exercises'],
                addedBy: adminUser._id,
                isApproved: true,
                qualityScore: 95
            },
            {
                type: 'lecture',
                title: 'NPTEL Programming in C by Prof. Indranil Sen Gupta',
                url: 'https://nptel.ac.in/courses/106105085',
                description: 'Complete C Programming course by Prof. Indranil Sen Gupta, IIT Kharagpur. Covers all fundamentals with practical examples and programming assignments.',
                provider: 'NPTEL - IIT Kharagpur',
                subjectRef: cseSubjects[0]._id,
                topics: ['C Basics', 'Control Structures', 'Functions', 'Arrays', 'Pointers'],
                tags: ['video-lectures', 'nptel', 'iit-kharagpur', 'complete-course', 'programming-assignments'],
                addedBy: moderatorUser._id,
                isApproved: true,
                qualityScore: 98
            },
            {
                type: 'lecture',
                title: 'CodeWithHarry C Programming Complete Course',
                url: 'https://www.youtube.com/watch?v=ZSPZob_1TOk',
                description: 'Complete C Programming tutorial in Hindi by CodeWithHarry. Perfect for beginners with hands-on coding examples and projects.',
                provider: 'CodeWithHarry',
                subjectRef: cseSubjects[0]._id,
                topics: ['C Basics', 'Control Structures', 'Functions', 'Projects'],
                tags: ['hindi', 'beginner-friendly', 'youtube', 'tutorial', 'projects'],
                addedBy: studentUser._id,
                isApproved: true,
                qualityScore: 88
            },
            {
                type: 'notes',
                title: 'C Programming Notes - GeeksforGeeks',
                url: 'https://www.geeksforgeeks.org/c-programming-language/',
                description: 'Comprehensive notes and examples for C Programming covering all topics with detailed code examples and explanations.',
                provider: 'GeeksforGeeks',
                subjectRef: cseSubjects[0]._id,
                topics: ['C Basics', 'Control Structures', 'Functions', 'Arrays', 'Pointers'],
                tags: ['notes', 'examples', 'reference', 'practice-problems', 'interview-prep'],
                addedBy: moderatorUser._id,
                isApproved: true,
                qualityScore: 90
            },
            {
                type: 'book',
                title: 'The C Programming Language by Dennis Ritchie & Brian Kernighan',
                url: 'https://www.amazon.in/Programming-Language-Dennis-M-Ritchie/dp/0131103628',
                description: 'The definitive guide to C programming by the creators of C language. Essential reading for serious programmers and computer science students.',
                provider: 'Prentice Hall',
                subjectRef: cseSubjects[0]._id,
                topics: ['C Basics', 'Control Structures', 'Functions', 'Arrays', 'Pointers'],
                tags: ['book', 'authoritative', 'reference', 'classic', 'computer-science'],
                addedBy: adminUser._id,
                isApproved: true,
                qualityScore: 98
            },

            // Data Structures Resources
            {
                type: 'lecture',
                title: 'Abdul Bari Data Structures and Algorithms',
                url: 'https://www.youtube.com/watch?v=0IAPZzGSbME&list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O',
                description: 'Complete Data Structures course by Abdul Bari. Excellent explanations with animations, examples, and step-by-step problem solving.',
                provider: 'Abdul Bari',
                subjectRef: cseSubjects[8]._id,
                topics: ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Trees', 'Graphs'],
                tags: ['video-lectures', 'animations', 'comprehensive', 'youtube', 'problem-solving'],
                addedBy: moderatorUser._id,
                isApproved: true,
                qualityScore: 96
            },
            {
                type: 'lecture',
                title: 'Gate Smashers Data Structures Complete Playlist',
                url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiEwaANNt3OqJPVIxwp2ebiT',
                description: 'Data Structures playlist by Gate Smashers. Perfect for GATE preparation and university exams with clear explanations in Hindi.',
                provider: 'Gate Smashers',
                subjectRef: cseSubjects[8]._id,
                topics: ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Trees'],
                tags: ['gate-preparation', 'university-exams', 'hindi', 'conceptual', 'exam-oriented'],
                addedBy: studentUser._id,
                isApproved: true,
                qualityScore: 92
            },
            {
                type: 'notes',
                title: 'Data Structures and Algorithms Tutorial - Tutorialspoint',
                url: 'https://www.tutorialspoint.com/data_structures_algorithms/index.htm',
                description: 'Comprehensive notes on Data Structures and Algorithms with implementations in multiple programming languages.',
                provider: 'Tutorialspoint',
                subjectRef: cseSubjects[8]._id,
                topics: ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Trees', 'Graphs'],
                tags: ['notes', 'implementations', 'multiple-languages', 'reference', 'tutorial'],
                addedBy: moderatorUser._id,
                isApproved: true,
                qualityScore: 85
            },

            // Algorithms Resources
            {
                type: 'lecture',
                title: 'MIT 6.006 Introduction to Algorithms',
                url: 'https://www.youtube.com/playlist?list=PLUl4u3cNGP61Oq3tWYp6V_F-5jb5L2iHb',
                description: 'MIT OpenCourseWare - Introduction to Algorithms. World-class lectures from MIT professors covering fundamental algorithms.',
                provider: 'MIT OpenCourseWare',
                subjectRef: cseSubjects[12]._id,
                topics: ['Algorithm Analysis', 'Sorting', 'Searching', 'Dynamic Programming', 'Greedy Algorithms'],
                tags: ['mit', 'university-lectures', 'world-class', 'advanced', 'theoretical'],
                addedBy: adminUser._id,
                isApproved: true,
                qualityScore: 98
            },
            {
                type: 'lecture',
                title: 'Aditya Verma Dynamic Programming Complete Series',
                url: 'https://www.youtube.com/playlist?list=PL_z_8CaSLPWekqhdCPmFohncHwz8TY2Go',
                description: 'Complete Dynamic Programming playlist by Aditya Verma. Excellent for interview preparation and competitive programming.',
                provider: 'Aditya Verma',
                subjectRef: cseSubjects[12]._id,
                topics: ['Dynamic Programming'],
                tags: ['dynamic-programming', 'interview-prep', 'competitive-programming', 'problem-solving', 'youtube'],
                addedBy: studentUser._id,
                isApproved: true,
                qualityScore: 94
            },
            {
                type: 'book',
                title: 'Introduction to Algorithms by Cormen, Leiserson, Rivest, and Stein',
                url: 'https://www.amazon.in/Introduction-Algorithms-Thomas-H-Cormen/dp/0262033844',
                description: 'The most comprehensive book on algorithms. Known as CLRS, this is the standard textbook for algorithms courses worldwide.',
                provider: 'MIT Press',
                subjectRef: cseSubjects[12]._id,
                topics: ['Algorithm Analysis', 'Sorting', 'Searching', 'Dynamic Programming', 'Greedy Algorithms'],
                tags: ['book', 'clrs', 'comprehensive', 'university-textbook', 'reference'],
                addedBy: adminUser._id,
                isApproved: true,
                qualityScore: 97
            },

            // Database Management Systems Resources
            {
                type: 'lecture',
                title: 'Jenny Lectures DBMS Complete Course',
                url: 'https://www.youtube.com/playlist?list=PLdo5W4Nhv31b33kF46f9aFjoJPOkdlsRc',
                description: 'Complete DBMS course by Jenny Lectures. Covers all topics from ER diagrams to advanced database concepts with practical examples.',
                provider: 'Jenny Lectures',
                subjectRef: cseSubjects[14]._id,
                topics: ['ER Model', 'SQL', 'Normalization', 'Transactions', 'Indexing'],
                tags: ['dbms', 'sql', 'database-design', 'youtube', 'comprehensive', 'practical'],
                addedBy: studentUser._id,
                isApproved: true,
                qualityScore: 89
            },
            {
                type: 'notes',
                title: 'DBMS Tutorial - JavaTpoint',
                url: 'https://www.javatpoint.com/dbms-tutorial',
                description: 'Comprehensive DBMS tutorial covering all concepts with examples, SQL queries, and practice exercises.',
                provider: 'JavaTpoint',
                subjectRef: cseSubjects[14]._id,
                topics: ['ER Model', 'SQL', 'Normalization', 'Transactions'],
                tags: ['tutorial', 'examples', 'sql-queries', 'reference', 'practice-exercises'],
                addedBy: moderatorUser._id,
                isApproved: true,
                qualityScore: 87
            },
            {
                type: 'book',
                title: 'Database System Concepts by Silberschatz, Galvin, and Gagne',
                url: 'https://www.amazon.in/Database-System-Concepts-Abraham-Silberschatz/dp/0078022150',
                description: 'Comprehensive textbook on database systems covering both theoretical concepts and practical implementation details.',
                provider: 'McGraw-Hill Education',
                subjectRef: cseSubjects[14]._id,
                topics: ['ER Model', 'SQL', 'Normalization', 'Transactions', 'Indexing'],
                tags: ['textbook', 'comprehensive', 'theory', 'practical', 'university-recommended'],
                addedBy: adminUser._id,
                isApproved: true,
                qualityScore: 95
            },

            // Operating Systems Resources
            {
                type: 'lecture',
                title: 'Gate Smashers Operating System Complete Course',
                url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFpg7cB8cDOcLYe6Yh41nWd',
                description: 'Complete Operating Systems course perfect for GATE preparation and university exams. Covers all OS concepts clearly.',
                provider: 'Gate Smashers',
                subjectRef: cseSubjects[16]._id,
                topics: ['Process Management', 'Memory Management', 'File Systems', 'Deadlocks'],
                tags: ['operating-systems', 'gate-prep', 'university-exams', 'hindi', 'conceptual'],
                addedBy: moderatorUser._id,
                isApproved: true,
                qualityScore: 91
            },
            {
                type: 'book',
                title: 'Operating System Concepts by Silberschatz, Galvin, and Gagne',
                url: 'https://www.amazon.in/Operating-System-Concepts-Abraham-Silberschatz/dp/1118063333',
                description: 'The classic textbook on Operating Systems known as the "Dinosaur Book". Comprehensive coverage of all OS concepts.',
                provider: 'John Wiley & Sons',
                subjectRef: cseSubjects[16]._id,
                topics: ['Process Management', 'Memory Management', 'File Systems', 'Deadlocks'],
                tags: ['textbook', 'comprehensive', 'classic', 'university-recommended', 'dinosaur-book'],
                addedBy: adminUser._id,
                isApproved: true,
                qualityScore: 96
            },

            // Computer Networks Resources
            {
                type: 'lecture',
                title: 'Gate Smashers Computer Networks Complete Course',
                url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_',
                description: 'Complete Computer Networks course perfect for GATE preparation covering all networking protocols and concepts.',
                provider: 'Gate Smashers',
                subjectRef: cseSubjects[17]._id,
                topics: ['OSI Model', 'TCP/IP', 'Routing', 'Network Security'],
                tags: ['computer-networks', 'gate-prep', 'networking', 'protocols', 'security'],
                addedBy: moderatorUser._id,
                isApproved: true,
                qualityScore: 93
            },
            {
                type: 'book',
                title: 'Computer Networks by Andrew S. Tanenbaum',
                url: 'https://www.amazon.in/Computer-Networks-Andrew-S-Tanenbaum/dp/9332518742',
                description: 'Classic textbook on computer networks covering all aspects from physical layer to application layer protocols.',
                provider: 'Pearson Education',
                subjectRef: cseSubjects[17]._id,
                topics: ['OSI Model', 'TCP/IP', 'Routing', 'Network Security'],
                tags: ['textbook', 'networking', 'protocols', 'comprehensive', 'tanenbaum'],
                addedBy: adminUser._id,
                isApproved: true,
                qualityScore: 94
            },

            // Web Technologies Resources
            {
                type: 'lecture',
                title: 'The Net Ninja HTML & CSS Crash Course',
                url: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9ivBf_eKCPIAYXWzLlPAm6G',
                description: 'Complete HTML & CSS crash course for beginners. Learn to build beautiful responsive websites from scratch.',
                provider: 'The Net Ninja',
                subjectRef: cseSubjects[21]._id,
                topics: ['HTML/CSS'],
                tags: ['web-development', 'html', 'css', 'responsive-design', 'beginner'],
                addedBy: studentUser._id,
                isApproved: true,
                qualityScore: 90
            },
            {
                type: 'lecture',
                title: 'Akshay Saini - Namaste JavaScript Series',
                url: 'https://www.youtube.com/playlist?list=PLlasXeu85E9cQ32gLCvAvr9vNaUccPVNP',
                description: 'Namaste JavaScript series by Akshay Saini. Deep dive into JavaScript concepts with excellent explanations.',
                provider: 'Akshay Saini',
                subjectRef: cseSubjects[21]._id,
                topics: ['JavaScript'],
                tags: ['javascript', 'advanced-concepts', 'interview-prep', 'deep-dive', 'namaste-js'],
                addedBy: moderatorUser._id,
                isApproved: true,
                qualityScore: 95
            },
            {
                type: 'lecture',
                title: 'FreeCodeCamp React Course for Beginners',
                url: 'https://www.youtube.com/watch?v=4UZrsTqkcW4',
                description: 'Complete React course for beginners. Build multiple projects and learn modern React development.',
                provider: 'FreeCodeCamp',
                subjectRef: cseSubjects[21]._id,
                topics: ['React/Angular'],
                tags: ['react', 'projects', 'modern-development', 'freecodecamp', 'beginner'],
                addedBy: studentUser._id,
                isApproved: true,
                qualityScore: 88
            },

            // Electronics Resources for ECE
            {
                type: 'lecture',
                title: 'NPTEL Basic Electronics by Prof. Chitralekha Mahanta',
                url: 'https://nptel.ac.in/courses/108105051',
                description: 'Comprehensive course on Basic Electronics covering diodes, transistors, and basic electronic circuits.',
                provider: 'NPTEL - IIT Guwahati',
                subjectRef: eceSubjects[0]._id,
                topics: ['Diodes', 'Transistors', 'Amplifiers'],
                tags: ['electronics', 'nptel', 'iit-guwahati', 'basic-electronics', 'circuits'],
                addedBy: moderatorUser._id,
                isApproved: true,
                qualityScore: 94
            },

            // EE (Electrical Engineering) Resources
            {
                type: 'lecture',
                title: 'NPTEL Circuit Analysis by Prof. S.S. Murthy',
                url: 'https://nptel.ac.in/courses/108103067',
                description: 'Comprehensive course on Circuit Analysis covering DC/AC circuits, network theorems, and circuit analysis techniques.',
                provider: 'NPTEL - IIT Madras',
                subjectRef: eeSubjects[0]._id,
                topics: ['Ohms Law', 'Kirchhoffs Laws', 'Network Theorems', 'AC Circuits'],
                tags: ['circuit-analysis', 'nptel', 'iit-madras', 'electrical-circuits', 'network-theorems'],
                addedBy: moderatorUser._id,
                isApproved: true,
                qualityScore: 96
            },
            {
                type: 'lecture',
                title: 'Gate Academy Electrical Machines',
                url: 'https://www.youtube.com/playlist?list=PLp6ek2hDcoNAQoOf92d-u9kd8_CpnhFAX',
                description: 'Complete Electrical Machines course covering DC machines, transformers, and AC machines for GATE preparation.',
                provider: 'Gate Academy',
                subjectRef: eeSubjects[1]._id,
                topics: ['DC Motors', 'DC Generators', 'Transformers'],
                tags: ['electrical-machines', 'gate-prep', 'motors', 'generators', 'transformers'],
                addedBy: studentUser._id,
                isApproved: true,
                qualityScore: 91
            },
            {
                type: 'book',
                title: 'Electrical Machines by P.S. Bimbhra',
                url: 'https://www.amazon.in/Electrical-Machines-P-S-Bimbhra/dp/8174091502',
                description: 'Comprehensive textbook on electrical machines covering theory and applications of DC and AC machines.',
                provider: 'Khanna Publishers',
                subjectRef: eeSubjects[1]._id,
                topics: ['DC Motors', 'DC Generators', 'Transformers'],
                tags: ['textbook', 'electrical-machines', 'bimbhra', 'theory', 'applications'],
                addedBy: adminUser._id,
                isApproved: true,
                qualityScore: 95
            },
            {
                type: 'lecture',
                title: 'Neso Academy Control Systems',
                url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRiw-GZRqfTkXnL-AaksFVhA',
                description: 'Complete Control Systems course covering transfer functions, stability analysis, and controller design.',
                provider: 'Neso Academy',
                subjectRef: eeSubjects[3]._id,
                topics: ['Transfer Functions', 'Stability', 'PID Controllers', 'Root Locus'],
                tags: ['control-systems', 'neso-academy', 'transfer-functions', 'stability', 'controllers'],
                addedBy: moderatorUser._id,
                isApproved: true,
                qualityScore: 93
            },

            // ME (Mechanical Engineering) Resources
            {
                type: 'lecture',
                title: 'NPTEL Engineering Mechanics by Prof. Manoj Soni',
                url: 'https://nptel.ac.in/courses/112104117',
                description: 'Comprehensive course on Engineering Mechanics covering statics, dynamics, and rigid body mechanics.',
                provider: 'NPTEL - IIT Guwahati',
                subjectRef: meSubjects[0]._id,
                topics: ['Statics', 'Dynamics', 'Force Systems', 'Friction'],
                tags: ['engineering-mechanics', 'nptel', 'iit-guwahati', 'statics', 'dynamics'],
                addedBy: moderatorUser._id,
                isApproved: true,
                qualityScore: 96
            },
            {
                type: 'lecture',
                title: 'Gate Smashers Thermodynamics',
                url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFNcn68ZR6p8-iJ0S_Zs8qm',
                description: 'Complete Thermodynamics course for mechanical engineering covering all laws and cycles.',
                provider: 'Gate Smashers',
                subjectRef: meSubjects[1]._id,
                topics: ['First Law', 'Second Law', 'Heat Engines', 'Refrigeration'],
                tags: ['thermodynamics', 'gate-smashers', 'heat-engines', 'refrigeration', 'cycles'],
                addedBy: studentUser._id,
                isApproved: true,
                qualityScore: 89
            },
            {
                type: 'book',
                title: 'Thermodynamics: An Engineering Approach by Cengel & Boles',
                url: 'https://www.amazon.in/Thermodynamics-Engineering-Approach-Yunus-Cengel/dp/0073398179',
                description: 'Comprehensive textbook on thermodynamics with engineering applications and real-world examples.',
                provider: 'McGraw Hill Education',
                subjectRef: meSubjects[1]._id,
                topics: ['First Law', 'Second Law', 'Heat Engines', 'Refrigeration'],
                tags: ['textbook', 'thermodynamics', 'cengel', 'engineering-approach', 'applications'],
                addedBy: adminUser._id,
                isApproved: true,
                qualityScore: 97
            },

            // CE (Civil Engineering) Resources
            {
                type: 'lecture',
                title: 'NPTEL Building Materials by Prof. Ravindra Gettu',
                url: 'https://nptel.ac.in/courses/104104091',
                description: 'Comprehensive course on building materials covering concrete, steel, and material testing.',
                provider: 'NPTEL - IIT Madras',
                subjectRef: ceSubjects[0]._id,
                topics: ['Concrete', 'Steel', 'Timber', 'Testing Methods'],
                tags: ['building-materials', 'nptel', 'iit-madras', 'concrete', 'material-testing'],
                addedBy: moderatorUser._id,
                isApproved: true,
                qualityScore: 95
            },
            {
                type: 'lecture',
                title: 'Civil Engineering Academy Structural Analysis',
                url: 'https://www.youtube.com/playlist?list=PLwjK_iyK4LLCdyeOLDp8_BhfRUeE-rW1l',
                description: 'Complete structural analysis course covering analysis of beams, frames, and trusses.',
                provider: 'Civil Engineering Academy',
                subjectRef: ceSubjects[1]._id,
                topics: ['Beams', 'Frames', 'Trusses', 'Deflection'],
                tags: ['structural-analysis', 'civil-engineering', 'beams', 'frames', 'analysis'],
                addedBy: studentUser._id,
                isApproved: true,
                qualityScore: 88
            },

            // Some pending approval resources for testing
            {
                type: 'notes',
                title: 'Advanced C Programming Techniques',
                url: 'https://github.com/example/advanced-c-notes',
                description: 'Advanced C programming techniques including memory management, optimization, and system programming.',
                provider: 'GitHub Community',
                subjectRef: cseSubjects[0]._id,
                topics: ['Advanced C', 'Memory Management', 'System Programming'],
                tags: ['advanced', 'system-programming', 'memory-management', 'github'],
                addedBy: studentUser._id,
                isApproved: false, // Pending approval
                qualityScore: 85
            },
            {
                type: 'lecture',
                title: 'Machine Learning Basics for CS Students',
                url: 'https://www.youtube.com/watch?v=example-ml-basics',
                description: 'Introduction to Machine Learning concepts for computer science students.',
                provider: 'CS Learning Hub',
                subjectRef: cseSubjects[22]._id,
                topics: ['Machine Learning Basics'],
                tags: ['machine-learning', 'ai', 'introduction', 'cs-students'],
                addedBy: studentUser._id,
                isApproved: false, // Pending approval
                qualityScore: 82
            }
        ]);

        // Create roadmaps
        logger.info('🗺️ Creating study roadmaps...');
        const roadmaps = await Roadmap.insertMany([
            // Data Structures Midsem Roadmap
            {
                subjectRef: cseSubjects[2]._id, // Data Structures
                type: 'midsem',
                title: 'Data Structures Midsem Preparation',
                description: 'Complete preparation roadmap for Data Structures midterm exam covering arrays, linked lists, stacks, and queues.',
                difficulty: 'intermediate',
                totalEstimatedHours: 40,
                steps: [
                    {
                        title: 'Fundamentals Review',
                        description: 'Review basic concepts of arrays and pointers',
                        order: 1,
                        estimatedHours: 6,
                        prerequisites: ['C/C++ basics'],
                        resources: [resources[0]._id, resources[1]._id] // Abdul Bari lectures
                    },
                    {
                        title: 'Arrays and Strings',
                        description: 'Master array operations and string manipulations',
                        order: 2,
                        estimatedHours: 8,
                        prerequisites: ['Fundamentals Review'],
                        resources: [resources[0]._id]
                    },
                    {
                        title: 'Linked Lists',
                        description: 'Understand singly, doubly, and circular linked lists',
                        order: 3,
                        estimatedHours: 10,
                        prerequisites: ['Arrays and Strings'],
                        resources: [resources[0]._id, resources[5]._id] // Cormen book
                    },
                    {
                        title: 'Stacks and Queues',
                        description: 'Implementation and applications of stacks and queues',
                        order: 4,
                        estimatedHours: 8,
                        prerequisites: ['Linked Lists'],
                        resources: [resources[0]._id]
                    },
                    {
                        title: 'Practice Problems',
                        description: 'Solve coding problems and previous year questions',
                        order: 5,
                        estimatedHours: 8,
                        prerequisites: ['Stacks and Queues'],
                        resources: [resources[0]._id, resources[5]._id]
                    }
                ],
                createdBy: moderatorUser._id,
                isPublic: true,
                tags: ['midsem', 'data-structures', 'programming', 'arrays', 'linked-lists']
            },

            // Algorithms Endsem Roadmap
            {
                subjectRef: cseSubjects[12]._id, // Design and Analysis of Algorithms
                type: 'endsem',
                title: 'Algorithms Complete Preparation',
                description: 'Comprehensive roadmap for Algorithms final exam covering sorting, searching, dynamic programming, and graph algorithms.',
                difficulty: 'advanced',
                totalEstimatedHours: 60,
                steps: [
                    {
                        title: 'Sorting Algorithms',
                        description: 'Master all sorting techniques and their complexities',
                        order: 1,
                        estimatedHours: 12,
                        prerequisites: ['Basic data structures'],
                        resources: [resources[6]._id, resources[7]._id] // Aditya Verma + CLRS
                    },
                    {
                        title: 'Graph Algorithms',
                        description: 'BFS, DFS, shortest path, and minimum spanning tree',
                        order: 2,
                        estimatedHours: 15,
                        prerequisites: ['Sorting Algorithms'],
                        resources: [resources[7]._id]
                    },
                    {
                        title: 'Dynamic Programming',
                        description: 'Master DP concepts and classical problems',
                        order: 3,
                        estimatedHours: 18,
                        prerequisites: ['Graph Algorithms'],
                        resources: [resources[6]._id, resources[7]._id]
                    },
                    {
                        title: 'Advanced Topics',
                        description: 'Greedy algorithms, backtracking, and optimization',
                        order: 4,
                        estimatedHours: 10,
                        prerequisites: ['Dynamic Programming'],
                        resources: [resources[7]._id]
                    },
                    {
                        title: 'Mock Exams',
                        description: 'Practice with previous years and mock tests',
                        order: 5,
                        estimatedHours: 5,
                        prerequisites: ['Advanced Topics'],
                        resources: [resources[6]._id, resources[7]._id]
                    }
                ],
                createdBy: moderatorUser._id,
                isPublic: true,
                tags: ['endsem', 'algorithms', 'dynamic-programming', 'graph-theory', 'optimization']
            },

            // EE Circuit Analysis Practical Roadmap
            {
                subjectRef: eeSubjects[0]._id, // Circuit Analysis
                type: 'practical',
                title: 'Circuit Analysis Lab Preparation',
                description: 'Hands-on roadmap for circuit analysis laboratory experiments and simulations.',
                difficulty: 'beginner',
                totalEstimatedHours: 25,
                steps: [
                    {
                        title: 'Circuit Basics',
                        description: 'Understanding basic circuit elements and laws',
                        order: 1,
                        estimatedHours: 5,
                        prerequisites: ['Basic mathematics'],
                        resources: [resources[26]._id] // NPTEL Circuit Analysis
                    },
                    {
                        title: 'Breadboard Practice',
                        description: 'Learn to build circuits on breadboard',
                        order: 2,
                        estimatedHours: 8,
                        prerequisites: ['Circuit Basics'],
                        resources: [resources[26]._id]
                    },
                    {
                        title: 'Measurement Techniques',
                        description: 'Using multimeters and oscilloscopes',
                        order: 3,
                        estimatedHours: 6,
                        prerequisites: ['Breadboard Practice'],
                        resources: [resources[26]._id]
                    },
                    {
                        title: 'Simulation Software',
                        description: 'SPICE and circuit simulation tools',
                        order: 4,
                        estimatedHours: 4,
                        prerequisites: ['Measurement Techniques'],
                        resources: [resources[26]._id]
                    },
                    {
                        title: 'Lab Report Writing',
                        description: 'Documenting experiments and results',
                        order: 5,
                        estimatedHours: 2,
                        prerequisites: ['Simulation Software'],
                        resources: [resources[26]._id]
                    }
                ],
                createdBy: moderatorUser._id,
                isPublic: true,
                tags: ['practical', 'circuit-analysis', 'lab', 'breadboard', 'measurement']
            },

            // Control Systems General Roadmap
            {
                subjectRef: eeSubjects[3]._id, // Control Systems
                type: 'general',
                title: 'Control Systems Complete Study Guide',
                description: 'Comprehensive roadmap for mastering control systems from basics to advanced topics.',
                difficulty: 'advanced',
                totalEstimatedHours: 50,
                steps: [
                    {
                        title: 'Mathematical Foundation',
                        description: 'Laplace transforms, complex analysis, and differential equations',
                        order: 1,
                        estimatedHours: 10,
                        prerequisites: ['Engineering Mathematics'],
                        resources: [resources[0]._id] // Using available resource as placeholder
                    },
                    {
                        title: 'System Modeling',
                        description: 'Transfer functions, block diagrams, and signal flow graphs',
                        order: 2,
                        estimatedHours: 12,
                        prerequisites: ['Mathematical Foundation'],
                        resources: [resources[0]._id]
                    },
                    {
                        title: 'Time Domain Analysis',
                        description: 'Transient and steady-state response analysis',
                        order: 3,
                        estimatedHours: 10,
                        prerequisites: ['System Modeling'],
                        resources: [resources[0]._id]
                    },
                    {
                        title: 'Frequency Domain Analysis',
                        description: 'Bode plots, Nyquist criteria, and stability margins',
                        order: 4,
                        estimatedHours: 12,
                        prerequisites: ['Time Domain Analysis'],
                        resources: [resources[0]._id]
                    },
                    {
                        title: 'Controller Design',
                        description: 'PID controllers, compensation techniques, and modern control',
                        order: 5,
                        estimatedHours: 6,
                        prerequisites: ['Frequency Domain Analysis'],
                        resources: [resources[0]._id]
                    }
                ],
                createdBy: moderatorUser._id,
                isPublic: true,
                tags: ['control-systems', 'electrical-engineering', 'transfer-functions', 'stability', 'pid']
            }
        ]);

        // Create sample resource ratings
        logger.info('⭐ Creating sample resource ratings...');
        const ratings = await ResourceRating.insertMany([
            // High ratings for popular resources
            {
                resourceRef: resources[0]._id, // Abdul Bari DSA
                userRef: studentUser._id,
                rating: 5,
                review: 'Excellent explanation of data structures. Very clear and easy to follow.',
                helpfulVotes: 12,
                isVerified: true
            },
            {
                resourceRef: resources[0]._id, // Abdul Bari DSA  
                userRef: adminUser._id,
                rating: 5,
                review: 'Best resource for learning data structures from basics to advanced.',
                helpfulVotes: 8,
                isVerified: true
            },
            {
                resourceRef: resources[5]._id, // CLRS book
                userRef: studentUser._id,
                rating: 4,
                review: 'Comprehensive but challenging. Good for reference.',
                helpfulVotes: 5,
                isVerified: false
            },
            {
                resourceRef: resources[6]._id, // Aditya Verma DP
                userRef: moderatorUser._id,
                rating: 5,
                review: 'Amazing DP playlist! Made complex concepts very simple.',
                helpfulVotes: 15,
                isVerified: true
            },
            {
                resourceRef: resources[7]._id, // CLRS Algorithms
                userRef: studentUser._id,
                rating: 4,
                review: 'Gold standard for algorithms. Dense but thorough.',
                helpfulVotes: 7,
                isVerified: false
            },
            {
                resourceRef: resources[10]._id, // Gate Smashers OS
                userRef: studentUser._id,
                rating: 5,
                review: 'Perfect for OS concepts. Covers everything needed for exams.',
                helpfulVotes: 9,
                isVerified: false
            },
            {
                resourceRef: resources[15]._id, // NPTEL Database
                userRef: moderatorUser._id,
                rating: 4,
                review: 'Solid database course with good examples.',
                helpfulVotes: 6,
                isVerified: true
            },
            {
                resourceRef: resources[26]._id, // NPTEL Circuit Analysis
                userRef: studentUser._id,
                rating: 4,
                review: 'Good for circuit fundamentals. Well structured content.',
                helpfulVotes: 4,
                isVerified: false
            }
        ]);

        // Update resource average ratings based on the sample ratings
        logger.info('📊 Updating resource rating aggregations...');
        const resourceRatingUpdates = [
            { resourceId: resources[0]._id, avgRating: 5.0, totalRatings: 2 }, // Abdul Bari DSA
            { resourceId: resources[5]._id, avgRating: 4.0, totalRatings: 1 }, // CLRS
            { resourceId: resources[6]._id, avgRating: 5.0, totalRatings: 1 }, // Aditya Verma DP
            { resourceId: resources[7]._id, avgRating: 4.0, totalRatings: 1 }, // CLRS Algorithms
            { resourceId: resources[10]._id, avgRating: 5.0, totalRatings: 1 }, // Gate Smashers OS
            { resourceId: resources[15]._id, avgRating: 4.0, totalRatings: 1 }, // NPTEL Database
            { resourceId: resources[26]._id, avgRating: 4.0, totalRatings: 1 }  // NPTEL Circuit Analysis
        ];

        for (const update of resourceRatingUpdates) {
            await Resource.findByIdAndUpdate(update.resourceId, {
                averageRating: update.avgRating,
                totalRatings: update.totalRatings
            });
        }

        logger.info('✅ Database seeded successfully!');
        logger.info('📊 Summary:');
        logger.info(`   🏫 Branches: ${branches.length}`);
        logger.info(`   🎓 Programs: ${programs.length}`);
        logger.info(`   📅 Years: ${years.length}`);
        logger.info(`   📚 Semesters: ${semesters.length}`);
        logger.info(`   📖 CSE Subjects: ${cseSubjects.length}`);
        logger.info(`   📖 ECE Subjects: ${eceSubjects.length}`);
        logger.info(`   🎥 Resources: ${resources.length}`);
        logger.info(`   🗺️ Roadmaps: ${roadmaps.length}`);
        logger.info(`   ⭐ Ratings: ${ratings.length}`);
        logger.info('');
        logger.info('👤 Test User Credentials:');
        logger.info('   📧 Admin: admin@campussyllabus.com | 🔑 Password: Admin@123');
        logger.info('   📧 Moderator: moderator@campussyllabus.com | 🔑 Password: Moderator@123');
        logger.info('   📧 Student: student@campussyllabus.com | 🔑 Password: Student@123');
        logger.info('');
        logger.info('🎯 Next Steps:');
        logger.info('   1. Login with admin credentials');
        logger.info('   2. Browse subjects by branch and semester');
        logger.info('   3. View resources for each subject');
        logger.info('   4. Test search functionality');
        logger.info('   5. Add new resources via /contribute page');
        logger.info('   6. Test approval workflow with pending resources');
        logger.info('   7. Explore study roadmaps for guided learning');

    } catch (error) {
        logger.error('❌ Error seeding database:');
        console.error(error);
        throw error;
    } finally {
        await mongoose.connection.close();
        logger.info('Database connection closed');
    }
}

// Run the seed function
seed()
    .then(() => {
        logger.info('🎉 Seeding completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        logger.error('💥 Seeding failed:');
        console.error(error);
        process.exit(1);
    });
