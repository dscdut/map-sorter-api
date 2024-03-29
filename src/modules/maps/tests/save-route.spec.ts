import { Test, TestingModule } from '@nestjs/testing';
import { SaveRouteUseCase } from '../usecases/save-route/save-route.usecase';
import { IRouteRepository } from '../repos/route.repository.interface';
import { mockRouteRepository } from './mocks/route.repository.mock';
import { SaveRouteRequestDto } from '../usecases/save-route/save-route.dto';
import { MapProvidersEnum } from '@shared/enum/map-providers.enum';
import { DuplicateRouteName } from '../usecases/save-route/save-route.errors';
import { failure } from '../../../core/logic/errors-handler';

describe('Save route usecase', () => {
  let routeRepository: IRouteRepository;
  let saveRouteUseCase: SaveRouteUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaveRouteUseCase,
        {
          provide: 'IRouteRepository',
          useValue: mockRouteRepository,
        },
      ],
    }).compile();

    routeRepository = module.get<IRouteRepository>('IRouteRepository');
    saveRouteUseCase = module.get<SaveRouteUseCase>(SaveRouteUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(saveRouteUseCase).toBeDefined();
  });

  it('should return a failure when route name already exists in the current user', async () => {
    // Arrange
    const userId = '123';
    const saveRouteDto: SaveRouteRequestDto = {
      name: 'My Route',
      pathDisplayInput: {
        overview_polyline: 'g|caBqonsS`{RlfI|~^wcGbvXcr\\j~^qsZnvNkoQ`',
        input_coordinate: [
          [37.772, -122.214],
          [21.291, -157.821],
          [-18.142, 178.431],
          [-27.467, 153.027],
          [37.772, -122.214],
          [21.291, -157.821],
        ],
        waypoint_order: [0, 1, 2, 3],
      },
      provider: MapProvidersEnum.GOOGLE_MAP,
    };

    // Act
    jest.spyOn(routeRepository, 'exists').mockResolvedValue(true);
    const result = await saveRouteUseCase.execute({
      saveRouteDto,
      userId,
    });

    // Assert
    expect(routeRepository.exists).toHaveBeenCalledWith('My Route', userId);
    expect(result.isFailure).toBeTruthy();
    expect(result).toEqual(failure(new DuplicateRouteName('My Route')));
  });

  it('should save the generated route for the current user', async () => {
    // Arrange
    const userId = '123';
    const saveRouteDto: SaveRouteRequestDto = {
      name: 'My Route',
      pathDisplayInput: {
        overview_polyline: 'g|caBqonsS`{RlfI|~^wcGbvXcr\\j~^qsZnvNkoQ`',
        input_coordinate: [
          [37.772, -122.214],
          [21.291, -157.821],
          [-18.142, 178.431],
          [-27.467, 153.027],
          [37.772, -122.214],
          [21.291, -157.821],
        ],
        waypoint_order: [0, 1, 2, 3],
      },
      provider: MapProvidersEnum.GOOGLE_MAP,
    };

    // Act
    jest.spyOn(routeRepository, 'exists').mockResolvedValue(false);
    jest.spyOn(routeRepository, 'save').mockResolvedValue();
    const result = await saveRouteUseCase.execute({
      saveRouteDto,
      userId,
    });

    // Assert
    expect(routeRepository.exists).toHaveBeenCalledWith('My Route', userId);
    expect(routeRepository.save).toHaveBeenCalled();
    expect(result.isSuccess).toBeTruthy();
  });
});
