export interface SignupRequestDTO {
  name: string;
  email: string;
  password: string;
}

export interface VerifyOtpRequestDTO {
  email: string;
  otp: string;
}

export interface ResendOtpRequestDTO {
  email: string;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface AuthStatusRequestDTO {
  refreshToken: string;
}

export interface VerifyEmailRequestDTO {
  email: string;
}

export interface ResetPasswordDTO {
  password: string;
  token: string;
}

export interface GoogleLoginRequestDTO {
  token: string;
}


