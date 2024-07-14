import { Router, Request, Response } from 'express';

import AuthService from './auth.service';
import { BasicGuard } from '../middleware/auth.guard';
import { UserModel } from '../user/entity/user.entity';

const router = Router();

/**
 * @swagger
 * /login/email:
 *   post:
 *     summary: 이메일로 로그인
 *     description: 이메일과 비밀번호를 사용하여 로그인합니다.
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Basic dXNlckBleGFtcGxlLmNvbTpwYXNzd29yZDEyMw==
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: 인증 실패
 *
 * /register/email:
 *   post:
 *     summary: 이메일로 회원가입
 *     description: 이메일, 비밀번호, 닉네임을 사용하여 회원가입합니다.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               nickname:
 *                 type: string
 *                 example: usernickname
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       409:
 *         description: 이미 존재하는 이메일
 */

router.post(
  '/login/email',
  BasicGuard,
  async (_request: Request, response: Response) => {
    const tokens = await AuthService.loginEmail(
      response.locals.user as Pick<UserModel, 'email' | 'password'>
    );
    return response.status(200).json(tokens);
  }
);

router.post('/register/email', async (request: Request, response: Response) => {
  const registerDto: Pick<UserModel, 'email' | 'password' | 'nickname'> = {
    email: request.body.email,
    password: request.body.password,
    nickname: request.body.nickname,
  };

  const tokens = await AuthService.registerEmail(registerDto);
  if (!tokens) return response.status(409).send('이미 존재하는 이메일입니다.');

  return response.status(201).json(tokens);
});

export default router;
