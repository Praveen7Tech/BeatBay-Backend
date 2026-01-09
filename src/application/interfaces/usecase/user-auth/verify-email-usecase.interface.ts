import { VerifyEmailRequestDTO } from "../../dto/auth/request.dto";

export interface IVerifyEmailUsecase {
    execute(request: VerifyEmailRequestDTO): Promise<void>;
}