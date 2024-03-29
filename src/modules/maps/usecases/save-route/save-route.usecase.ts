import * as polyline from '@mapbox/polyline';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SaveRouteCommand } from './save-route.command';
import { SaveRouteResponse } from './save-route.response';
import { Inject } from '@nestjs/common';
import { IRouteRepository } from '@modules/maps/repos/route.repository.interface';
import { Route } from '@modules/maps/domain/route';
import { Result, failure, success } from '@core/logic/errors-handler';
import { DuplicateRouteName } from './save-route.errors';
import { UnexpectedError } from '@core/logic/application-error';

@CommandHandler(SaveRouteCommand)
export class SaveRouteUseCase
  implements ICommandHandler<SaveRouteCommand, SaveRouteResponse>
{
  constructor(
    @Inject('IRouteRepository')
    private readonly routeRepository: IRouteRepository,
  ) {}

  async execute({
    saveRouteDto,
    userId,
  }: SaveRouteCommand): Promise<SaveRouteResponse> {
    let route: Route;

    const routeExists = await this.routeRepository.exists(
      saveRouteDto.name,
      userId,
    );

    if (routeExists) {
      return failure(new DuplicateRouteName(saveRouteDto.name));
    } else {
      const routeOrError: Result<Route> = Route.create({
        name: saveRouteDto.name,
        pathDisplay: saveRouteDto.pathDisplayInput
          ? {
              overview_polyline:
                saveRouteDto.pathDisplayInput.overview_polyline,
              waypoint_order: saveRouteDto.pathDisplayInput.waypoint_order,
              input_polyline: polyline.encode(
                saveRouteDto.pathDisplayInput.input_coordinate,
              ),
            }
          : null,
        provider: saveRouteDto.provider,
        userId: userId,
      });

      if (routeOrError.isFailed) {
        return failure(new UnexpectedError('Failed to create route'));
      }

      route = routeOrError.getValue();
      await this.routeRepository.save(route);
    }

    return success(Result.ok());
  }
}
