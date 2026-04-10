import { app } from '@/server';
import request from 'supertest';

describe('Server running test', () => {
  it('should run the server', async () => {
    const response = await request(app).get('/test');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Server is running');
  });
});
