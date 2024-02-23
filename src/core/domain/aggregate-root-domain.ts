import { AggregateRoot } from '@nestjs/cqrs';
import { UniqueEntityID } from './unique-entity-id';

const isEntity = (v: any): v is AggregateRootDomain<any> => {
  return v instanceof AggregateRootDomain;
};

export abstract class AggregateRootDomain<T> extends AggregateRoot {
  protected readonly _id: UniqueEntityID;
  public readonly props: T;

  constructor(props: T, id?: UniqueEntityID) {
    super();
    this._id = id ? id : new UniqueEntityID();
    this.props = props;
  }

  public equals(object?: AggregateRootDomain<T>): boolean {
    if (object == null || object == undefined) {
      return false;
    }

    if (this == object) {
      return true;
    }

    if (!isEntity(object)) {
      return false;
    }

    return this._id.equals(object._id);
  }
}
