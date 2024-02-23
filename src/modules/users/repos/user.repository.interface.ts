import { User } from '../domain/user';

export interface IUserRepository {
  exists(email: string): Promise<boolean>;
  save(user: User): Promise<void>;
  findOneBy(options: Record<string, any>): Promise<User>;
}
