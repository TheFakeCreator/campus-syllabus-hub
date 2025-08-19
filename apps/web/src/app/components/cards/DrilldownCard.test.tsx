import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DrilldownCard } from './DrilldownCard';

describe('DrilldownCard', () => {
    it('renders branch, year, and semester', () => {
        render(<DrilldownCard branch="CSE" year="2" semester="3" />);
        expect(screen.getByText('CSE')).toBeInTheDocument();
        expect(screen.getByText('Year: 2')).toBeInTheDocument();
        expect(screen.getByText('Semester: 3')).toBeInTheDocument();
    });
});
