import request from 'supertest';
import app from '../app.js';
import { describe, it, expect } from 'vitest';

describe('API Routes', () => {
    it('should return 404 for unknown route', async () => {
        const res = await request(app).get('/api/v1/unknown');
        expect(res.status).toBe(404);
    });
    // Add more integration tests for routes
});
