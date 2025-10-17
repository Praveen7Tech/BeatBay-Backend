import { createContainer, asClass, asFunction, asValue, InjectionMode } from 'awilix';
import { MongooseUserRepository } from '../presistence/mongoose/repositories/mongoose.user.repository'; 
import { RedisCacheServive } from '../cache/redis/redis-cache.service';
import { PasswordService } from '../services/password/password-service'; 
import { SignupUsecase } from '../../usecases/auth/signup.useCase';
import { VerifyOtpUsecase } from '../../usecases/auth/verify-otp.useCase';
import { AuthController } from '../../interfaces/http/controllers/auth.controller';
import { ICacheService } from '../../domain/services/cache.service';
import { IPasswordService } from '../../domain/services/password.service';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { ResendOtpUseCase } from '../../usecases/auth/resend-otp.useCase';
import { IOtpService } from '../../domain/services/otp.service';
import { OtpService } from '../services/otp/otp-service';
import { LoginUsecase } from '../../usecases/auth/login.useCase';
import { JwtTokenService } from '../services/token/jwt-token.service';
import { ITokenService } from '../../domain/services/token.service';
import { AuthStatusUsecase } from '../../usecases/auth/authStatus.useCase';

const container = createContainer({ injectionMode: InjectionMode.CLASSIC });

container.register({
  // Infrastructure
  userRepository: asClass<IUserRepository>(MongooseUserRepository).scoped(),
  cacheService: asClass<ICacheService>(RedisCacheServive).singleton(),
  passwordService: asClass<IPasswordService>(PasswordService).scoped(),
  otpService: asClass<IOtpService>(OtpService).scoped(),
  tokenService: asClass<ITokenService>(JwtTokenService).scoped(),

  // Use cases
  signupUsecase: asClass(SignupUsecase).scoped(),
  verifyOtpUsecase: asClass(VerifyOtpUsecase).scoped(),
  resendOtpUsecase: asClass(ResendOtpUseCase).scoped(),
  loginUsecase: asClass(LoginUsecase).scoped(),
  jwtTokenUsecase: asClass(JwtTokenService).scoped(),
  authStatusUsecase: asClass(AuthStatusUsecase),

  // Controllers
  authController: asClass(AuthController).scoped(),
});

export default container;
