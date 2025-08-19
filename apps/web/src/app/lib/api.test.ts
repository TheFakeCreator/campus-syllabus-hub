import { http } from 'msw';
import { setupServer } from 'msw/node';
import api from './api';

describe('api client', () => {
    const server = setupServer(
        http.get('https://api.example.com/test', () => {
            return Response.json({ data: 'ok' });
        })
    );

    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    it('fetches data', async () => {
        const res = await api.get('https://api.example.com/test');
        expect(res.data.data).toBe('ok');
    });
});
