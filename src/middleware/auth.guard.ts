import { NextFunction, Request, Response } from 'express';

import AuthService from '../auth/auth.service';

export const BasicGuard = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const rawToken = request.headers['authorization'];
  if (!rawToken) return response.status(401).send('토큰이 비어있습니다.');

  const token = AuthService.extractTokenFromRawToken(rawToken, 'Basic');
  if (!token) return response.status(401).send('Basic Token이 필요합니다.');

  const loginInfo = AuthService.decodeBasicToken(token);
  if (!loginInfo)
    return response.status(401).send('유효하지 않은 Token정보 입니다.');

  const { user, message } =
    await AuthService.authenticateWithEmailAndPassword(loginInfo);
  if (!user) return response.status(401).send(message);

  response.locals.user = loginInfo;

  next();
};
