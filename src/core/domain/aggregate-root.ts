import { Entity } from './entity';
import { UniqueEntityID } from './unique-entity-id';
import { DomainEvents } from './events/domain-event';
import { IDomainEvent } from './events/domain-event.interface';

export abstract class AggregateRoot<T> extends Entity<T> {
  private _domainEvents: IDomainEvent[] = [];

  get id(): UniqueEntityID {
    return this._id;
  }

  get domainEvents(): IDomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(domainEvent: IDomainEvent): void {
    this.domainEvents.push(domainEvent);
    DomainEvents.markAggregateForDispatch(this);
    this.logDomainEventAdded(domainEvent);
  }

  public clearEvents(): void {
    this._domainEvents.splice(0, this._domainEvents.length);
  }

  private logDomainEventAdded(domainEvent: IDomainEvent): void {
    const thisClass = Reflect.getPrototypeOf(this);
    const domainEventClass = Reflect.getPrototypeOf(domainEvent);

    // eslint-disable-next-line no-console
    console.log(
      '[Domain Event Created]: ',
      thisClass.constructor.name,
      '==>',
      domainEventClass.constructor.name,
    );
  }
}
