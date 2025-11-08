import z from "zod";
import { emailValidator, nameValidator, otpValidator, passwordValidator, tokenValidator } from "../../../../common/validator/validation.schema";

export const SignupRequestSchema = z.object({
  name: nameValidator,
  email: emailValidator,
  password: passwordValidator
});

export const VerifyOtpRequestSchema = z.object({
  email:emailValidator,
  otp: otpValidator
});

export const ResendOtpRequestSchema = z.object({
  email: emailValidator
});

export const LoginRequestSchema = z.object({
  email: emailValidator,
  password:passwordValidator
});

export const AuthStatusRequestSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required")
});

export const VerifyEmailRequestSchema = z.object({
  email: emailValidator
});

export const ResetPassRequestSchema = z.object({
  password:passwordValidator,
  token: tokenValidator
});

export const GoogleLoginRequestSchema = z.object({
  token: tokenValidator
});


