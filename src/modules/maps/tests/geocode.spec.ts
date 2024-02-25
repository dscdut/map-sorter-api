import { Test, TestingModule } from '@nestjs/testing';
import { IMapService } from '../services/map.service.interface';
import { mockMapService } from '../services/tests/mocks/map.service.mock';
import { GeocodeUseCase } from '../usecases/geocode/geocode.usecase';
import { GeocodeRequestDto } from '../usecases/geocode/geocode.dto';
import { failure } from '@core/logic/errors-handler';
import { NotFoundLocationFromAddress } from '../usecases/geocode/geocode.errors';

describe('Geocode usecase', () => {
  let geocodeUseCase: GeocodeUseCase;
  let mapService: IMapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeocodeUseCase,
        {
          provide: 'IMapService',
          useValue: mockMapService,
        },
      ],
    }).compile();

    geocodeUseCase = module.get<GeocodeUseCase>(GeocodeUseCase);
    mapService = module.get<IMapService>('IMapService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(geocodeUseCase).toBeDefined();
  });

  it('should return failure when location not found from given address', async () => {
    // Arrange
    const geocodeRequestDto: GeocodeRequestDto = {
      params: {
        address: 'invalid address',
        key: 'YOUR_API_KEY',
      },
    };
    jest.spyOn(mapService, 'geocode').mockResolvedValue(null);

    // Act
    const result = await geocodeUseCase.execute({ geocodeRequestDto });

    // Assert
    expect(mapService.geocode).toHaveBeenCalledWith(geocodeRequestDto);
    expect(result.isFailure()).toBeTruthy();
    expect(result).toEqual(failure(new NotFoundLocationFromAddress()));
  });

  it('should return location with lat and lng from given address', async () => {
    // Arrange
    const geocodeRequestDto: GeocodeRequestDto = {
      params: {
        address: 'valid address',
        key: 'YOUR_API_KEY',
      },
    };
    jest.spyOn(mapService, 'geocode').mockResolvedValue({
      data: {
        location: {
          lat: 123.456,
          lng: 789.123,
        },
      },
    });

    // Act
    const result = await geocodeUseCase.execute({ geocodeRequestDto });

    // Assert
    expect(mapService.geocode).toHaveBeenCalledWith(geocodeRequestDto);
    expect(result.isSuccess()).toBeTruthy();
    expect(result.value.getValue()).toEqual({
      location: {
        lat: 123.456,
        lng: 789.123,
      },
    });
  });
});
