import { Test, TestingModule } from '@nestjs/testing';
import { IMapService } from '../map.service.interface';
import { mockMapService } from './mocks/map.service.mock';
import { IDirectionsRequest } from '../dtos/directions-request.interface';

describe('MapService', () => {
  let mapService: IMapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'IMapService',
          useValue: mockMapService,
        },
      ],
    }).compile();

    mapService = module.get<IMapService>('IMapService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(mapService).toBeDefined();
  });

  describe('Given a string address', () => {
    it('should return a geocode response consists of longitude and latitude', async () => {
      // Arrange
      const address = '1600 Amphitheatre Parkway, Mountain View, CA';
      const key = 'YOUR_MAP_API_KEY';

      // Act
      const response = await mapService.geocode({ params: { key, address } });

      // Assert
      expect(response.data.location).toBeDefined();
      expect(response.data.location.lat).toBeDefined();
      expect(response.data.location.lng).toBeDefined();
    });
  });

  describe('Given an origin, a destination and some waypoints in the LatLng form', () => {
    it('should return an optimized route go through all waypoints', async () => {
      // Arrange
      const request: IDirectionsRequest = {
        params: {
          key: 'YOUR_MAP_API_KEY',
          origin: { lat: 37.7749, lng: -122.4194 },
          destination: { lat: 37.4224764, lng: -122.0842499 },
          waypoints: [
            { lat: 37.3318, lng: -122.0312 },
            { lat: 36.9741, lng: -122.0308 },
          ],
          optimize: true,
        },
      };

      // Act
      const response = await mapService.directions(request);

      // Assert
      expect(response.data.status).toBe('OK');
      expect(response.data.routes).toBeDefined();
    });
  });
});
