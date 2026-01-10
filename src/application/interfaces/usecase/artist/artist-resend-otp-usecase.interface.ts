import { ResendOtpRequestDTO } from "../../../dto/auth/request.dto";
import { ResendOtpResponseDTO } from "../../../dto/auth/response.dto";

export interface IArtistResendOtpUseCase {
    execute(request: ResendOtpRequestDTO): Promise<ResendOtpResponseDTO>;
}