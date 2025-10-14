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

const container = createContainer({ injectionMode: InjectionMode.CLASSIC });
console.log("con-",container)

container.register({
  // Infrastructure
  userRepository: asClass<IUserRepository>(MongooseUserRepository).scoped(),
  cacheService: asClass<ICacheService>(RedisCacheServive).singleton(),
  passwordService: asClass<IPasswordService>(PasswordService).scoped(),

  // Use cases
  signupUsecase: asClass(SignupUsecase).scoped(),
  verifyOtpUsecase: asClass(VerifyOtpUsecase).scoped(),

  // Controllers
  authController: asClass(AuthController).scoped(),
});

export default container;
