import { AggregateRootDomain } from '@core/domain/aggregate-root-domain';
import { UniqueEntityID } from '@core/domain/unique-entity-id';
import { RouteId } from './value-objects/route-id';
import { Result } from '@core/logic/errors-handler';
import { Guard } from '@core/logic/guard';

class PathDisplay {
  overview_polyline?: string;
  input_polyline?: string;
  waypoint_order?: number[];
}

interface RouteProps {
  name: string;
  pathDisplay?: PathDisplay;
  provider: string;
  userId: string;
}

export class Route extends AggregateRootDomain<RouteProps> {
  private constructor(props: RouteProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get id(): RouteId {
    return RouteId.create(this._id).getValue();
  }

  get name(): string {
    return this.props.name;
  }

  get pathDisplay(): PathDisplay {
    return this.props.pathDisplay;
  }

  get provider(): string {
    return this.props.provider;
  }

  get userId(): string {
    return this.props.userId;
  }

  public static create(props: RouteProps, id?: UniqueEntityID): Result<Route> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { arg: props.name, argName: 'name' },
      { arg: props.provider, argName: 'provider' },
      { arg: props.userId, argName: 'userId' },
    ]);

    if (guardResult.isFailed) {
      return Result.fail<Route>(guardResult.getErrorValue());
    }

    const route = new Route(
      {
        ...props,
      },
      id,
    );

    return Result.ok<Route>(route);
  }
}
