import React from 'react';

export const EmptyState: React.FC<{ message?: string }> = ({ message }) => (
    <div className="text-center text-muted-foreground py-8">
        {message ?? 'No data found.'}
    </div>
);
