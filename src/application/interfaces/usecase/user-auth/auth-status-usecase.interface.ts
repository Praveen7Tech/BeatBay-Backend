import { AuthStatusRequestDTO } from "../../../dto/auth/request.dto";
import { LoginResponseDTO } from "../../../dto/auth/response.dto";

export interface IAuthStatusUsecase {
  execute(request: AuthStatusRequestDTO): Promise<LoginResponseDTO>;
}