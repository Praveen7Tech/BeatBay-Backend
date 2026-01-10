import { GoogleLoginRequestDTO } from "../../../dto/auth/request.dto";
import { LoginResponseDTO } from "../../../dto/auth/response.dto";

export interface IArtistGoogleLoginUseCase {
  execute(request: GoogleLoginRequestDTO): Promise<LoginResponseDTO>;
}