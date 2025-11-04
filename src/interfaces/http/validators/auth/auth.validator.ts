import z from "zod";

export const SignupRequestSchema = z.object({
  name: z.string().min(1, "name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "password must be at least 6 characters")
});

export const VerifyOtpRequestSchema = z.object({
  email: z.string().email("Invalid email"),
  otp: z.string().min(4, "OTP is required")
});

export const ResendOtpRequestSchema = z.object({
  email: z.string().email("Invalid email")
});

export const LoginRequestSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const AuthStatusRequestSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required")
});

export const VerifyEmailRequestSchema = z.object({
  email: z.string().email("Invalid email")
});

export const ResetPassRequestSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  token: z.string().min(1, "token is required")
});

export const GoogleLoginRequestSchema = z.object({
  token: z.string().min(1, "token is required")
});


