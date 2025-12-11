import {  asClass,  asValue,  } from 'awilix';
import { MongooseUserRepository } from '../../presistence/mongoose/repositories/mongoose.user.repository'; 
import { RedisCacheServive } from '../../cache/redis/redis-cache.service';
import { PasswordService } from '../../services/password/password-service'; 
import { SignupUsecase } from '../../../usecases/user/auth/signup.useCase';
import { VerifyOtpUsecase } from '../../../usecases/user/auth/verify-otp.useCase';
import { AuthController } from '../../../interfaces/http/controllers/user/auth.controller';
import { ICacheService } from '../../../domain/services/cache.service';
import { IPasswordService } from '../../../domain/services/password.service';
import { IUserRepository } from '../../../domain/repositories/user.repository';
import { ResendOtpUseCase } from '../../../usecases/user/auth/resend-otp.useCase';
import { IOtpService } from '../../../domain/services/otp.service';
import { OtpService } from '../../services/otp/otp-service';
import { LoginUsecase } from '../../../usecases/user/auth/login.useCase';
import { JwtTokenService } from '../../services/token/jwt-token.service';
import { ITokenService } from '../../../domain/services/token.service';
import { AuthStatusUsecase } from '../../../usecases/user/auth/authStatus.useCase';
import { IEmailService } from '../../../domain/services/mail.service';
import { EmailService } from '../../services/email/email-service';
import { VerifyEmailUsecase } from '../../../usecases/user/auth/verify-email.useCase';
import { ResetPasswordUsecase } from '../../../usecases/user/auth/reset-password.useCase';
import { GoogleLoginUsecase } from '../../../usecases/user/auth/googleLogin.useCase';
import { IGoogleAuthService } from '../../../domain/services/google-auth.service';
import { GoogleAuthService } from '../../services/googleAuth/google-auth.service';

export const authModule = {
      // as value
      _clientId: asValue(process.env.GOOGLE_CLIENT_ID),
    
      // Infrastructure
      _userRepository: asClass<IUserRepository>(MongooseUserRepository).scoped(),
      _cacheService: asClass<ICacheService>(RedisCacheServive).singleton(),
      _passwordService: asClass<IPasswordService>(PasswordService).scoped(),
      _otpService: asClass<IOtpService>(OtpService).scoped(),
      _tokenService: asClass<ITokenService>(JwtTokenService).scoped(),
      _emailService: asClass<IEmailService>(EmailService).singleton(),
      _googleAuthService: asClass<IGoogleAuthService>(GoogleAuthService).singleton(),
    
      // Use cases
      signupUsecase: asClass(SignupUsecase).scoped(),
      verifyOtpUsecase: asClass(VerifyOtpUsecase).scoped(),
      resendOtpUsecase: asClass(ResendOtpUseCase).scoped(),
      loginUsecase: asClass(LoginUsecase).scoped(),
      authStatusUsecase: asClass(AuthStatusUsecase).scoped(),
      verifyEmailUsecase: asClass(VerifyEmailUsecase).scoped(),
      resetPasswordUsecase:asClass(ResetPasswordUsecase).scoped(),
      googleLoginUsecase: asClass(GoogleLoginUsecase).scoped(),
    
      // Controllers
      authController: asClass(AuthController).scoped(),
      
}