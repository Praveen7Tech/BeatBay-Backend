import { AuthPayload  } from "../interfaces/jwt-payload.interface"

export interface ITokenService {
    generateAccessToken(payload: AuthPayload ): Promise<string>,
    generateRefressToken(payload: AuthPayload ): Promise<string>,
    verifyAccessToken(token: string): Promise<AuthPayload  | null>,
    verifyRefreshToken(token: string): Promise<AuthPayload  | null>,
    generateResetToken(id:string): Promise<string>
    verifyResetToken(token: string): Promise<string | null>
}