import { User } from "../../../domain/entities/user.entity"

export interface SignupResponseDTO {
    otp: string
}

export interface ResendOtpResponseDTO {
    otp: string
}

export interface LoginResponseDTO {
    accessToken:string,
    refreshToken:string
}

export interface authStatusResponseDTO{
    user: User
    accessToken: string,
    refreshToken: string
}