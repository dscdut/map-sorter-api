import { Test, TestingModule } from '@nestjs/testing';
import { IMapService } from '../map.service.interface';
import { mockMapService } from './mocks/map.service.mock';

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

  it('MapService: Given a string address, should return a geocode response consists of longitude and latitude', async () => {
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
