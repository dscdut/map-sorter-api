import { Mapper } from '@core/domain/mapper';
import { User } from '../../domain/user';
import { TUserOrm } from './user';
import { UniqueEntityID } from '@core/domain/unique-entity-id';

export class UserMap implements Mapper<User> {
  public static async toDomain(raw: any): Promise<User> {
    const userOrError = User.create(
      {
        fullName: raw.full_name,
        email: raw.email,
        avatar: raw.avatar,
      },
      new UniqueEntityID(raw.id),
    );

    // eslint-disable-next-line no-console
    userOrError.isFailed ? console.log(userOrError.getErrorValue()) : '';

    return userOrError.isSuccess ? userOrError.getValue() : null;
  }

  public static async toPersistence(user: User): Promise<TUserOrm> {
    return {
      id: user.id.getStringValue(),
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
    };
  }
}
