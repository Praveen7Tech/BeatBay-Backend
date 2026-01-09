import { VerifyOtpRequestDTO } from "../../dto/auth/request.dto";

export interface IVerifyOtpUsecase {
  execute(request: VerifyOtpRequestDTO): Promise<void>;
}