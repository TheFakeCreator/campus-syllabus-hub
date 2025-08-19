import { Router } from 'express';

const subjectRouter = Router();

subjectRouter.get('/:code', (req, res) => {
    // Get subject by code - to be implemented
    res.status(501).json({ message: 'Subject by code endpoint not implemented yet' });
});

subjectRouter.get('/:code/resources', (req, res) => {
    // Get resources for subject - to be implemented
    res.status(501).json({ message: 'Subject resources endpoint not implemented yet' });
});

export default subjectRouter;
