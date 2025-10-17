import dotenv from 'dotenv'
dotenv.config()
import { ITokenService } from "../../../domain/services/token.service";
import  jwt  from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET!
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET!

export class JwtTokenService implements ITokenService {
    async generateAccessToken(payload: object): Promise<string> {
        return jwt.sign(payload, ACCESS_TOKEN_SECRET, {expiresIn: "15m"})
    }

    async generateRefressToken(payload: object): Promise<string> {
        return jwt.sign(payload, REFRESH_TOKEN_SECRET, {expiresIn: "7d"})
    }

    async verifyAccessToken(token?: string) {
    if (!token) return null;
    try {
      return jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (err) {
      return null;
        }
    }

    async verifyRefreshToken(token?: string) {
        if (!token) return null;
        try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET);
        } catch (err) {
        return null;
        }
    }
}