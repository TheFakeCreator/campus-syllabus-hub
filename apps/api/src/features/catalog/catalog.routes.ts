import { Router } from 'express';
import { Branch } from './branch.model.js';
import { Program } from './program.model.js';
import { Year } from './year.model.js';
import { Semester } from './semester.model.js';
import { Subject } from './subject.model.js';

const router = Router();

// Get all branches
router.get('/branches', async (req, res) => {
    try {
        const branches = await Branch.find().sort({ code: 1 });
        res.json(branches);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch branches' });
    }
});

// Get all programs
router.get('/programs', async (req, res) => {
    try {
        const programs = await Program.find().populate('branchRef').sort({ name: 1 });
        res.json(programs);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch programs' });
    }
});

// Get programs by branch
router.get('/branches/:branchId/programs', async (req, res) => {
    try {
        const programs = await Program.find({ branchRef: req.params.branchId })
            .populate('branchRef')
            .sort({ name: 1 });
        res.json(programs);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch programs for branch' });
    }
});

// Get years for a program
router.get('/programs/:programId/years', async (req, res) => {
    try {
        const years = await Year.find({ programRef: req.params.programId })
            .populate('programRef')
            .sort({ year: 1 });
        res.json(years);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch years for program' });
    }
});

// Get semesters for a year
router.get('/years/:yearId/semesters', async (req, res) => {
    try {
        const semesters = await Semester.find({ yearRef: req.params.yearId })
            .populate('yearRef')
            .sort({ number: 1 });
        res.json(semesters);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch semesters for year' });
    }
});

// Get subjects for a semester
router.get('/semesters/:semesterId/subjects', async (req, res) => {
    try {
        const subjects = await Subject.find({ semesterRef: req.params.semesterId })
            .populate(['branchRef', 'semesterRef'])
            .sort({ code: 1 });
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch subjects for semester' });
    }
});

// Get complete catalog structure
router.get('/structure', async (req, res) => {
    try {
        const branches = await Branch.find().sort({ code: 1 });
        const structure: any[] = [];

        for (const branch of branches) {
            const programs = await Program.find({ branchRef: branch._id }).sort({ name: 1 });
            const branchData: any = {
                ...branch.toObject(),
                programs: []
            };

            for (const program of programs) {
                const years = await Year.find({ programRef: program._id }).sort({ year: 1 });
                const programData: any = {
                    ...program.toObject(),
                    years: []
                };

                for (const year of years) {
                    const semesters = await Semester.find({ yearRef: year._id }).sort({ number: 1 });
                    const yearData: any = {
                        ...year.toObject(),
                        semesters: []
                    };

                    for (const semester of semesters) {
                        const subjects = await Subject.find({ semesterRef: semester._id }).sort({ code: 1 });
                        yearData.semesters.push({
                            ...semester.toObject(),
                            subjects: subjects.map(s => s.toObject())
                        });
                    }

                    programData.years.push(yearData);
                }

                branchData.programs.push(programData);
            }

            structure.push(branchData);
        }

        res.json(structure);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch catalog structure' });
    }
});

export default router;
