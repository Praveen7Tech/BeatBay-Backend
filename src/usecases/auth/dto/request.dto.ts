import z from "zod"

export const SignupRequestSchema  = z.object({
    name: z.string().min(1,"name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "password must be atleast 6 charecters")
})

export type SignupRequestDTO = z.infer<typeof SignupRequestSchema>

// Verify OTP
export const VerifyOtpRequestSchema = z.object({
  email: z.string().email("Invalid email"),
  otp: z.string().min(4, "OTP is required")
});
export type VerifyOtpRequestDTO = z.infer<typeof VerifyOtpRequestSchema>;

// Resend OTP
export const ResendOtpRequestSchema = z.object({
  email: z.string().email("Invalid email")
});
export type ResendOtpRequestDTO = z.infer<typeof ResendOtpRequestSchema>;

// Login
export const LoginRequestSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});
export type LoginRequestDTO = z.infer<typeof LoginRequestSchema>;

// Auth Status / Refresh Token
export const AuthStatusRequestSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required")
});
export type AuthStatusRequestDTO = z.infer<typeof AuthStatusRequestSchema>;

// verify email for ret password
export const VerifyEmailRequestSchema = z.object({
  email: z.string().email("Invalid email")
})

export type VerifyEmailRequestDTO = z.infer<typeof VerifyEmailRequestSchema>

// reset password
export const ResetPassRequestSchema = z.object({
  password: z.string().min(6, "password must be atleast 6 charecters"),
  token: z.string().min(1, "token is required")
})

export type ResetPasswordDTO = z.infer<typeof ResetPassRequestSchema>

// google login
export const GoogleLoginRequestSchema = z.object({
  token: z.string().min(1, "token is required")
})

export type GoogleLoginRequestDTO = z.infer<typeof GoogleLoginRequestSchema>


// edit profile

export const EditProfileSchema = z.object({
  name: z.string().min(2, "name is required").optional(),
  password: z.string().min(6, "password must be atleast 6 charecters").optional(),
  profileImage: z.string().min(1, "image must be needed").optional()
})

export type EditProfileRequest = z.infer<typeof EditProfileSchema>