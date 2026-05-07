import { RefreshTokenValidateResponse } from "../../../dto/auth/response.dto";

export interface IRefreshTokenValidateUsecase{
    execute(token: string): Promise<RefreshTokenValidateResponse>
}