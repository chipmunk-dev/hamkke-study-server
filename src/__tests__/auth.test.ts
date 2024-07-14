import request from 'supertest';
import app from '../index'; // Express 앱을 export 해야 합니다.
import AppDataSource from '../db/db';
import redisClient from '../db/redis';
import bcrypt from 'bcrypt';
import * as userService from '../user/user.service';

jest.mock('../db/db', () => ({
  __esModule: true,
  default: {
    initialize: jest.fn().mockResolvedValue(true),
    destroy: jest.fn().mockResolvedValue(true),
    getRepository: jest.fn().mockReturnValue({
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    }),
  },
}));

jest.mock('../db/redis', () => ({
  __esModule: true,
  default: {
    once: jest.fn((event, callback) => callback()),
    quit: jest.fn().mockResolvedValue(true),
  },
}));

jest.mock('../user/user.service');

describe('Auth API', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    await new Promise((resolve) => redisClient.once('connect', resolve));
  });

  afterAll(async () => {
    await AppDataSource.destroy();
    await redisClient.quit();
  });

  describe('POST /auth/register/email', () => {
    it('회원가입 성공', async () => {
      const mockUser = {
        email: 'newuser@example.com',
        password: 'password123',
        nickname: 'newuser',
      };

      (userService.getUserByEmail as jest.Mock).mockResolvedValue(null);
      (userService.createUser as jest.Mock).mockResolvedValue({
        ...mockUser,
        id: 1,
      });

      const res = await request(app)
        .post('/auth/register/email')
        .send(mockUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
    });

    it('회원가입 실패 -> 이미 존재하는 이메일', async () => {
      const mockUser = {
        email: 'newuser@example.com',
        password: 'password123',
        nickname: 'newuser',
      };

      (userService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/auth/register/email')
        .send(mockUser);

      expect(res.status).toBe(409);
    });
  });

  describe('POST /auth/login/email', () => {
    const mockUser = {
      email: 'test@example.com',
      password: 'password',
    };
    const credentials = Buffer.from(
      `${mockUser.email}:${mockUser.password}`
    ).toString('base64');

    it('로그인 성공', async () => {
      (userService.getUserByEmail as jest.Mock).mockResolvedValue({
        ...mockUser,
        id: 1,
        password: await bcrypt.hash(mockUser.password, 10),
      });

      const res = await request(app)
        .post('/auth/login/email')
        .set('Authorization', `Basic ${credentials}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
    });

    it('로그인 실패 -> 토큰 없음', async () => {
      const res = await request(app).post('/auth/login/email');

      expect(res.status).toBe(401);
      // Todo: 에러 메세지 형태 확립 후 테스트
    });

    it('로그인 실패 -> Basic 토큰이 아님', async () => {
      const res = await request(app)
        .post('/auth/login/email')
        .set('Authorization', `Bearer ${credentials}`);

      expect(res.status).toBe(401);
    });
    it('로그인 실패 -> 토큰 정보 ', async () => {
      const failCredentials = Buffer.from(`abcd:efg`).toString('base64');
      const res = await request(app)
        .post('/auth/login/email')
        .set('Authorization', `Basic ${failCredentials}`);

      expect(res.status).toBe(401);
    });

    it('로그인 실패 -> 존재하지 않는 이메일', async () => {
      (userService.getUserByEmail as jest.Mock).mockResolvedValue(null);
      const res = await request(app)
        .post('/auth/login/email')
        .set('Authorization', `Basic ${credentials}`);

      expect(res.status).toBe(401);
    });

    it('로그인 실패 -> 비밀번호 불일치', async () => {
      (userService.getUserByEmail as jest.Mock).mockResolvedValue({
        ...mockUser,
        id: 1,
        password: await bcrypt.hash('different password', 10),
      });
      const res = await request(app)
        .post('/auth/login/email')
        .set('Authorization', `Basic ${credentials}`);

      expect(res.status).toBe(401);
    });
  });
});
