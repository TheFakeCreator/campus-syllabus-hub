import { render, screen } from '@testing-library/react';
import { ResourceList } from './ResourceList';

const resources = [
    {
        id: '1',
        title: 'Resource 1',
        type: 'PDF',
        tags: ['tag1'],
        provider: 'Provider',
        providerFavicon: '/favicon.ico',
        qualityScore: 5,
        link: 'https://example.com',
    },
];

describe('ResourceList', () => {
    it('renders resource title and type', () => {
        render(<ResourceList resources={resources} />);
        expect(screen.getByText('Resource 1')).toBeInTheDocument();
        expect(screen.getByText('PDF')).toBeInTheDocument();
    });
});
