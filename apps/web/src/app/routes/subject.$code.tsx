
import React from 'react';
const Subject = React.lazy(() => import('@/app/components/SubjectHeader').then(mod => ({ default: mod.SubjectHeader })));

export default function SubjectPage() {
    return (
        <main role="main" className="min-h-screen">
            <React.Suspense fallback={<div>Loading...</div>}>
                <Subject code="SUBJ101" credits={4} name="Sample Subject" />
            </React.Suspense>
            <section aria-label="Subject Content" className="p-4">
                Subject Page
            </section>
        </main>
    );
}
