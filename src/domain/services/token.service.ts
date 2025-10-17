
export interface ITokenService {
    generateAccessToken(payload: object): Promise<string>,
    generateRefressToken(payload: object): Promise<string>,
    verifyAccessToken(token: string): any,
    verifyRefreshToken(token: string): any
}