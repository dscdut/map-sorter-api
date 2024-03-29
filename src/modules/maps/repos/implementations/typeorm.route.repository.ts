import { Injectable } from '@nestjs/common';
import { IRouteRepository } from '../route.repository.interface';
import { EntityManager } from 'typeorm';
import { Route } from '@modules/maps/domain/route';
import { RouteEntity } from '@database/typeorm/entities/route.entity';
import { RouteMap } from '@modules/maps/domain/mappers/route/route.mapper';

@Injectable()
export class TypeOrmRouteRepository implements IRouteRepository {
  constructor(private readonly model: EntityManager) {}

  async exists(name: string, userId: string): Promise<boolean> {
    const routeModel = this.model.getRepository(RouteEntity);

    const foundRoute = await routeModel.findOneBy({
      name: name,
      userId: userId,
    });

    return !!foundRoute === true;
  }

  async save(route: Route): Promise<void> {
    const routeModel = this.model.getRepository(RouteEntity);

    const routeExists = await this.exists(route.name, route.userId);
    if (!routeExists) {
      const rawRoute = await RouteMap.toPersistence(route);
      await routeModel.save(rawRoute);
    }

    return;
  }

  async findOneBy(options: Record<string, any>): Promise<Route> {
    const routeModel = this.model.getRepository(RouteEntity);

    const foundRoute = await routeModel.findOneBy(options);

    if (!foundRoute) return null;
    return RouteMap.toDomain(foundRoute);
  }
}
