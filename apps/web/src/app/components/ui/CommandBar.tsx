import React from 'react';
// Simple kbar-like command bar placeholder
export const CommandBar: React.FC<{ actions: Array<{ label: string; onAction: () => void }> }> = ({ actions }) => (
    <div className="fixed bottom-4 right-4 bg-background border shadow-lg rounded-lg p-2 z-50">
        <div className="flex gap-2">
            {actions.map((a, i) => (
                <button key={i} className="btn btn-sm" onClick={a.onAction}>{a.label}</button>
            ))}
        </div>
    </div>
);
