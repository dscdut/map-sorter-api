import { Route } from '../domain/route';

export interface IRouteRepository {
  exists(name: string, userId: string): Promise<boolean>;
  save(route: Route): Promise<void>;
  findOneBy(options: Record<string, any>): Promise<Route>;
}
