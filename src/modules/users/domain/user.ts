import { AggregateRootDomain } from '@core/domain/aggregate-root-domain';
import { UniqueEntityID } from '@core/domain/unique-entity-id';
import { Result } from '@core/logic/errors-handler';
import { Guard } from '@core/logic/guard';
import { UserId } from './value-objects/user-id';

interface UserProps {
  fullName: string;
  email: string;
  avatar: string;
}

export class User extends AggregateRootDomain<UserProps> {
  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get id(): UserId {
    return UserId.create(this._id).getValue();
  }

  get fullName(): string {
    return this.props.fullName;
  }

  get email(): string {
    return this.props.email;
  }

  get avatar(): string {
    return this.props.avatar;
  }

  public static create(props: UserProps, id?: UniqueEntityID): Result<User> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { arg: props.fullName, argName: 'fullName' },
      { arg: props.email, argName: 'email' },
      { arg: props.avatar, argName: 'avatar' },
    ]);

    if (guardResult.isFailed) {
      return Result.fail<User>(guardResult.getErrorValue());
    }

    const user = new User(
      {
        ...props,
      },
      id,
    );

    return Result.ok<User>(user);
  }
}
