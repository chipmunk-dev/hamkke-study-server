import request from 'supertest';
import app from '../index'; // Express 앱을 export 해야 합니다.

// 데이터베이스와 Redis 클라이언트를 Mocking
jest.mock('../db/db', () => ({
  __esModule: true,
  default: {
    initialize: jest.fn().mockResolvedValue(true),
    destroy: jest.fn().mockResolvedValue(true),
  },
}));

jest.mock('../db/redis', () => ({
  __esModule: true,
  default: {
    once: jest.fn((event, callback) => callback()),
    quit: jest.fn().mockResolvedValue(true),
  },
}));

describe('GET /', () => {
  it('should return 200 and Hello, TypeScript with Express!', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
  });
});
