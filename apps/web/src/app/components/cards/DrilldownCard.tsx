import React from 'react';

interface DrilldownCardProps {
    branch: string;
    year: string;
    semester: string;
    onClick?: () => void;
}

export const DrilldownCard: React.FC<DrilldownCardProps> = ({ branch, year, semester, onClick }) => (
    <div className="rounded-lg border p-4 shadow hover:bg-muted cursor-pointer" onClick={onClick}>
        <div className="font-bold text-lg">{branch}</div>
        <div className="text-sm text-muted-foreground">Year: {year}</div>
        <div className="text-sm text-muted-foreground">Semester: {semester}</div>
    </div>
);
