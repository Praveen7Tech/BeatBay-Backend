import { VerifyOtpRequestDTO } from "../../../dto/auth/request.dto";

export interface IArtistVerifyOTPuseCase {
    execute(request: VerifyOtpRequestDTO): Promise<void>;
}