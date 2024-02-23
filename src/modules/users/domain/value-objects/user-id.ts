import { UniqueEntityID } from '@core/domain/unique-entity-id';
import { ValueObject } from '@core/domain/value-object';
import { Result } from '@core/logic/errors-handler';
import { Guard } from '@core/logic/guard';

export class UserId extends ValueObject<{ value: UniqueEntityID }> {
  private constructor(value: UniqueEntityID) {
    super({ value });
  }

  getStringValue(): string {
    return this.props.value.toString();
  }

  getValue(): UniqueEntityID {
    return this.props.value;
  }

  public static create(value: UniqueEntityID): Result<UserId> {
    const guardResult = Guard.againstNullOrUndefined(value, 'value');
    if (guardResult.isFailed) {
      return Result.fail<UserId>(guardResult.getErrorValue());
    }

    return Result.ok<UserId>(new UserId(value));
  }
}
