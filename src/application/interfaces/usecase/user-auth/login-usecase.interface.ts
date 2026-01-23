import { LoginRequestDTO } from "../../../dto/auth/request.dto";
import { LoginResponseDTO } from "../../../dto/auth/response.dto";


export interface ILoginUsecase {
    execute(request: LoginRequestDTO): Promise<LoginResponseDTO>;
}