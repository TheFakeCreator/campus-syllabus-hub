import React from 'react';

interface SubjectHeaderProps {
    code: string;
    credits: number;
    name: string;
}

export const SubjectHeader: React.FC<SubjectHeaderProps> = ({ code, credits, name }) => (
    <header className="flex items-center gap-4 py-2 border-b mb-4">
        <div className="font-bold text-xl">{name}</div>
        <span className="bg-muted px-2 py-1 rounded text-xs font-mono">{code}</span>
        <span className="text-xs text-muted-foreground">{credits} credits</span>
    </header>
);
