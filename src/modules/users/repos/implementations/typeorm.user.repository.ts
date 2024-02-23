import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../user.repository.interface';
import { EntityManager } from 'typeorm';
import { User as UserEntity } from '@database/typeorm/entities';
import { User } from './../../domain/user';
import { UserMap } from '@modules/users/mappers/user/user.mapper';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(private readonly model: EntityManager) {}

  async exists(email: string): Promise<boolean> {
    const userModel = this.model.getRepository(UserEntity);

    const foundUser = await userModel.findOneBy({
      email: email,
    });

    return !!foundUser === true;
  }

  async save(user: User): Promise<void> {
    const userModel = this.model.getRepository(UserEntity);

    const userExists = await this.exists(user.email);
    if (!userExists) {
      const rawUser = await UserMap.toPersistence(user);
      await userModel.save(rawUser);
    }

    return;
  }

  async findOneBy(options: Record<string, any>): Promise<User> {
    const userModel = this.model.getRepository(UserEntity);

    const foundUser = await userModel.findOneBy(options);

    if (!foundUser) return null;
    return UserMap.toDomain(foundUser);
  }
}
