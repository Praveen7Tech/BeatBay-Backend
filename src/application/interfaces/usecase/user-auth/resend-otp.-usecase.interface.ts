import { ResendOtpRequestDTO } from "../../../dto/auth/request.dto";
import { ResendOtpResponseDTO } from "../../../dto/auth/response.dto";


export interface IResendOtpUseCase {
    execute(request: ResendOtpRequestDTO): Promise<ResendOtpResponseDTO>;
}