import { GoogleLoginRequestDTO } from "../../dto/auth/request.dto";
import { GoogleAuthResponseDTO } from "../../dto/auth/response.dto";

export interface IGoogleLoginUsecase {
  execute(request: GoogleLoginRequestDTO): Promise<GoogleAuthResponseDTO>;
}