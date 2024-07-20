import AppDataSource from '../db/db';
import { UserModel } from './entity/user.entity';

export const getUserByEmail = async (
  email: string
): Promise<UserModel | null> => {
  const userRepository = AppDataSource.getRepository(UserModel);
  const user = await userRepository.findOne({ where: { email } });

  return user;
};

export const createUser = async (
  registerDto: Pick<UserModel, 'email' | 'password' | 'nickname'>
) => {
  const userRepository = AppDataSource.getRepository(UserModel);
  const userInfo = userRepository.create(registerDto);
  const newUser = await userRepository.save(userInfo);

  return newUser;
};

export default { getUserByEmail, createUser };
