import { Mapper } from '@core/domain/mapper';
import { Route } from '../../route';
import { UniqueEntityID } from '@core/domain/unique-entity-id';
import { TRouteOrm } from './route';

export class RouteMap implements Mapper<Route> {
  public static async toDomain(raw: any): Promise<Route> {
    const routeOrError = Route.create(
      {
        name: raw.name,
        pathDisplay: raw.path_display,
        provider: raw.provider,
        userId: raw.user_id,
      },
      new UniqueEntityID(raw.id),
    );

    // eslint-disable-next-line no-console
    routeOrError.isFailed ? console.log(routeOrError.getErrorValue()) : '';

    return routeOrError.isSuccess ? routeOrError.getValue() : null;
  }

  public static async toPersistence(route: Route): Promise<TRouteOrm> {
    return {
      id: route.id.getStringValue(),
      name: route.name,
      pathDisplay: route.pathDisplay,
      provider: route.provider,
      userId: route.userId,
    };
  }
}
