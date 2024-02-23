import { Result } from '@core/logic/errors-handler';
import { User } from '@modules/users/domain/user';

export const createUserStub = (): Result<User> => {
  return User.create({
    fullName: 'John Doe',
    email: 'johndoe@gmail.com',
    avatar: 'http://www.avatar.com/avatar.jpg',
  });
};
