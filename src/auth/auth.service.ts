import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import { UserModel } from '../user/entity/user.entity';
import UserService from '../user/user.service';
import { env } from '../const/env';

const registerEmail = async (
  registerDto: Pick<UserModel, 'email' | 'password' | 'nickname'>
) => {
  const findUser = await UserService.getUserByEmail(registerDto.email);
  if (findUser) return null;

  const hashPassword = await hash(registerDto.password, env.BC_SALT_ROUNDS);
  const newUser = await UserService.createUser({
    ...registerDto,
    password: hashPassword,
  });

  return generateToken(newUser);
};

const loginEmail = async (user: Pick<UserModel, 'email' | 'password'>) => {
  const findUser = await UserService.getUserByEmail(user.email);
  return generateToken(findUser as UserModel);
};

const generateToken = (user: Pick<UserModel, 'id' | 'email'>) => {
  const accessToken = signToken(user, false);
  const refreshToken = signToken(user, true);

  return { accessToken, refreshToken };
};

const signToken = (
  user: Pick<UserModel, 'id' | 'email'>,
  isRefreshToken: boolean
) => {
  const payload = {
    email: user.email,
    sub: user.id,
    type: isRefreshToken ? 'refresh' : 'access',
  };

  return sign(payload, env.JWT_SECRET, {
    expiresIn: isRefreshToken ? 3600 : 600,
  });
};

const extractTokenFromRawToken = (
  rawToken: string,
  target: 'Basic' | 'Bearer'
) => {
  const [type, token] = rawToken.split(' ');

  if (type !== target) {
    return null;
  }

  return token;
};

const decodeBasicToken = (token: string) => {
  const decodedToken = Buffer.from(token, 'base64').toString('utf-8');
  const [email, password] = decodedToken.split(':');

  if (!email || !password) {
    return null;
  }

  return { email, password };
};

const authenticateWithEmailAndPassword = async (
  user: Pick<UserModel, 'email' | 'password'>
) => {
  const findUser = await UserService.getUserByEmail(user.email);
  if (!findUser) return { user: null, message: '존재하지 않는 이메일입니다.' };

  const match = await compare(user.password, findUser.password);
  if (!match) return { user: null, message: '비밀번호가 일치하지 않습니다.' };

  return { user: findUser, message: null };
};

export default {
  registerEmail,
  loginEmail,
  extractTokenFromRawToken,
  decodeBasicToken,
  authenticateWithEmailAndPassword,
};
