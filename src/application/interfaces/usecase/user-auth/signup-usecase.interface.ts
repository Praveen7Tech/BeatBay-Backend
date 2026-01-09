import { SignupRequestDTO } from "../../dto/auth/request.dto";
import { SignupResponseDTO } from "../../dto/auth/response.dto";

export interface ISignupUsecase {
  execute(dto: SignupRequestDTO): Promise<SignupResponseDTO>;
}