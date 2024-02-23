import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { mockJwtService } from './mocks/jwt.mock';
import { IUserRepository } from '../repos/user.repository.interface';
import { mockUserRepository } from './mocks/user.repository.mock';
import { LoginWithGoogleUseCase } from '../usecases/login-with-google/login-with-google.usecase';
import { mockGoogleOAuthService } from './mocks/google-oauth.service.mock';
import { OAuthService } from '../services/auth/providers/google/oauth.service';
import { AuthGoogleLoginDto } from '../usecases/login-with-google/login-with-google.dto';
import { failure } from '@core/logic/errors-handler';
import {
  InvalidIdToken,
  UserProfileNotFound,
} from '../usecases/login-with-google/login-with-google.errors';

describe('Login With Google Usecase', () => {
  let userRepository: IUserRepository;
  let jwtService: JwtService;
  let oauthService: OAuthService;
  let loginWithGoogleUseCase: LoginWithGoogleUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginWithGoogleUseCase,
        {
          provide: 'IUserRepository',
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: OAuthService,
          useValue: mockGoogleOAuthService,
        },
      ],
    }).compile();

    userRepository = module.get<IUserRepository>('IUserRepository');
    loginWithGoogleUseCase = module.get<LoginWithGoogleUseCase>(
      LoginWithGoogleUseCase,
    );
    jwtService = module.get<JwtService>(JwtService);
    oauthService = module.get<OAuthService>(OAuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(loginWithGoogleUseCase).toBeDefined();
  });

  describe('Given an idToken', () => {
    it('should return failure if the idToken is invalid', async () => {
      // Arrange
      const loginDto: AuthGoogleLoginDto = {
        idToken: 'invalid_token',
      };

      // Act
      const result = await loginWithGoogleUseCase.execute({ loginDto });

      // Assert
      expect(oauthService.validate).toHaveBeenCalledWith(loginDto.idToken);
      expect(result).toEqual(failure(new InvalidIdToken()));
    });

    it('should return failure if cannot retrieve user profile info', async () => {
      // Arrange
      const loginDto: AuthGoogleLoginDto = {
        idToken: '1112',
      };
      jest.spyOn(oauthService, 'validate').mockResolvedValue(true);
      jest
        .spyOn(oauthService, 'getUserProfileInfo')
        .mockRejectedValue(new Error('User profile not found'));

      // Act
      const result = await loginWithGoogleUseCase.execute({ loginDto });

      // Assert
      expect(oauthService.validate).toBeTruthy();
      expect(oauthService.getUserProfileInfo).toHaveBeenCalledWith(
        loginDto.idToken,
      );
      expect(result).toEqual(failure(new UserProfileNotFound()));
    });

    it('should return a user and a access token if idToken is valid', async () => {
      // Arrange
      const loginDto: AuthGoogleLoginDto = {
        idToken: 'valid_token',
      };
      jest.spyOn(oauthService, 'validate').mockResolvedValue(true);
      jest.spyOn(oauthService, 'getUserProfileInfo').mockResolvedValue({
        sub_id: '123',
        email: 'test@gmail.com',
        fullName: 'Test User',
        avatar: 'avatar.jpg',
      });

      // Act
      const result = await loginWithGoogleUseCase.execute({ loginDto });

      // Assert
      expect(result.isSuccess).toBeTruthy();
      expect(oauthService.validate).toHaveBeenCalledWith(loginDto.idToken);
      expect(oauthService.getUserProfileInfo).toHaveBeenCalledWith(
        loginDto.idToken,
      );
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: 'test@gmail.com',
      });
      expect(jwtService.sign).toHaveBeenCalled();
    });
  });
});
