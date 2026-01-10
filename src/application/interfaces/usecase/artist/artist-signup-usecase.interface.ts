import { SignupRequestDTO } from "../../../dto/auth/request.dto";
import { SignupResponseDTO } from "../../../dto/auth/response.dto";

export interface IArtistSignupUsecase {
    execute(request: SignupRequestDTO): Promise<SignupResponseDTO>;
}