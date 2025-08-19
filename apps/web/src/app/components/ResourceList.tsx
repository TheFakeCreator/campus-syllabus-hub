import React from 'react';

interface Resource {
    id: string;
    title: string;
    type: string;
    tags: string[];
    provider: string;
    providerFavicon: string;
    qualityScore: number;
    link: string;
}

interface ResourceListProps {
    resources: Resource[];
    onCopyLink?: (link: string) => void;
}


export const ResourceList: React.FC<ResourceListProps> = ({ resources, onCopyLink }) => (
    <section aria-label="Resource List">
        <ul className="space-y-2">
            {resources.map(r => (
                <li
                    key={r.id}
                    className="flex items-center gap-3 p-3 border rounded-lg shadow focus-within:ring-2 focus-within:ring-primary"
                    tabIndex={0}
                >
                    <div className="aspect-square w-5 h-5 flex items-center justify-center">
                        <img
                            src={r.providerFavicon}
                            alt={r.provider}
                            className="w-full h-full object-contain"
                            loading="lazy"
                        />
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold">{r.title}</div>
                        <div className="flex gap-2 text-xs">
                            <span className="badge bg-muted">{r.type}</span>
                            {r.tags.map(tag => (
                                <span key={tag} className="badge bg-muted-foreground">{tag}</span>
                            ))}
                        </div>
                    </div>
                    <span className="text-xs font-bold text-green-600">{r.qualityScore}</span>
                    <button
                        className="btn btn-xs focus:ring-2 focus:ring-primary"
                        onClick={() => onCopyLink?.(r.link)}
                        aria-label={`Copy link for ${r.title}`}
                    >
                        Copy link
                    </button>
                </li>
            ))}
        </ul>
    </section>
);
