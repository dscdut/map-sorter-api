import { Test, TestingModule } from '@nestjs/testing';
import { IMapService } from '../services/map.service.interface';
import { GetOptimizedRouteUseCase } from '../usecases/get-optimized-route/get-optimized-route.usecase';
import { mockMapService } from '../services/tests/mocks/map.service.mock';
import { GetOptimizedRouteRequestDto } from '../usecases/get-optimized-route/get-optimized-route.dto';
import { failure } from '@core/logic/errors-handler';
import { NotFoundOptimizedRoute } from '../usecases/get-optimized-route/get-optimized-route.errors';

describe('Get optimized route usecase', () => {
  let getOptimizedRouteUseCase: GetOptimizedRouteUseCase;
  let mapService: IMapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetOptimizedRouteUseCase,
        {
          provide: 'IMapService',
          useValue: mockMapService,
        },
      ],
    }).compile();

    getOptimizedRouteUseCase = module.get<GetOptimizedRouteUseCase>(
      GetOptimizedRouteUseCase,
    );

    mapService = module.get<IMapService>('IMapService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(getOptimizedRouteUseCase).toBeDefined();
  });

  it('should return failure when optimized route not found', async () => {
    // Arrange
    const getOptimizedRouteRequestDto: GetOptimizedRouteRequestDto = {
      params: {
        key: 'YOUR_MAP_API_KEY',
        origin: {
          lat: 123.456,
          lng: 126.789,
        },
        destination: {
          lat: 158.456,
          lng: 178.679,
        },
        waypoints: [
          {
            lat: 23.456,
            lng: 26.789,
          },
          {
            lat: 85.456,
            lng: 62.789,
          },
        ],
        optimize: true,
      },
    };
    jest.spyOn(mapService, 'directions').mockResolvedValue(null);

    // Act
    const result = await getOptimizedRouteUseCase.execute({
      getOptimizedRouteRequestDto,
    });

    // Assert
    expect(mapService.directions).toHaveBeenCalledWith(
      getOptimizedRouteRequestDto,
    );
    expect(result.isFailure()).toBeTruthy();
    expect(result).toEqual(failure(new NotFoundOptimizedRoute()));
  });

  it('should return optimized route with geocoded waypoints and routes', async () => {
    // Arrange
    const getOptimizedRouteRequestDto: GetOptimizedRouteRequestDto = {
      params: {
        key: 'YOUR_MAP_API_KEY',
        origin: {
          lat: 123.456,
          lng: 126.789,
        },
        destination: {
          lat: 158.456,
          lng: 178.679,
        },
        waypoints: [
          {
            lat: 23.456,
            lng: 26.789,
          },
          {
            lat: 85.456,
            lng: 62.789,
          },
        ],
        optimize: true,
      },
    };
    jest.spyOn(mapService, 'directions').mockResolvedValue({
      data: {
        geocoded_waypoints: [
          {
            geocoder_status: 'OK',
            place_id: 'ChIJ7cmZVrK3j4ARbMMDIJdJbuA',
            types: ['street_address'],
          },
          {
            geocoder_status: 'OK',
            place_id: 'ChIJtYuu0V264lQRQrfeQ5K5Oxw',
            types: ['establishment', 'point_of_interest', 'university'],
          },
        ],
        routes: [
          {
            bounds: {
              northeast: { lat: 37.422569, lng: -122.084379 },
              southwest: { lat: 37.422003, lng: -122.084927 },
            },
            copyright: 'Map data ©2022 Google',
            legs: [
              {
                distance: { text: '1.0 mi', value: 1609 },
                duration: { text: '6 mins', value: 360 },
                end_address: 'Mountain View, CA, USA',
                end_location: { lat: 37.4224764, lng: -122.0842499 },
                start_address:
                  'Google Building 41, 1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA',
                start_location: { lat: 37.422485, lng: -122.084248 },
                steps: [], // populate this array with Step objects as needed
                traffic_speed_entry: [],
                via_waypoint: [],
              },
            ],
            overview_polyline: 'a~l~Fjk~uOwHJy@P',
            summary: '1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA',
            warnings: [],
            waypoint_order: [],
          },
        ],
        status: 'OK',
      },
    });

    // Act
    const result = await getOptimizedRouteUseCase.execute({
      getOptimizedRouteRequestDto,
    });

    // Assert
    expect(mapService.directions).toHaveBeenCalledWith(
      getOptimizedRouteRequestDto,
    );
    expect(result.isSuccess()).toBeTruthy();
    expect(result.value.getValue()).toEqual({
      geocoded_waypoints: [
        {
          geocoder_status: 'OK',
          place_id: 'ChIJ7cmZVrK3j4ARbMMDIJdJbuA',
          types: ['street_address'],
        },
        {
          geocoder_status: 'OK',
          place_id: 'ChIJtYuu0V264lQRQrfeQ5K5Oxw',
          types: ['establishment', 'point_of_interest', 'university'],
        },
      ],
      routes: [
        {
          bounds: {
            northeast: { lat: 37.422569, lng: -122.084379 },
            southwest: { lat: 37.422003, lng: -122.084927 },
          },
          copyright: 'Map data ©2022 Google',
          legs: [
            {
              distance: { text: '1.0 mi', value: 1609 },
              duration: { text: '6 mins', value: 360 },
              end_address: 'Mountain View, CA, USA',
              end_location: { lat: 37.4224764, lng: -122.0842499 },
              start_address:
                'Google Building 41, 1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA',
              start_location: { lat: 37.422485, lng: -122.084248 },
              steps: [],
              traffic_speed_entry: [],
              via_waypoint: [],
            },
          ],
          overview_polyline: 'a~l~Fjk~uOwHJy@P',
          summary: '1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA',
          warnings: [],
          waypoint_order: [],
        },
      ],
      status: 'OK',
    });
  });
});
