import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`animate-pulse bg-muted rounded ${className ?? 'h-6 w-full'}`}></div>
);
