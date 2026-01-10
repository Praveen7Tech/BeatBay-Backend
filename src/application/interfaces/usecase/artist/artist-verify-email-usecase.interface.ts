import { VerifyEmailRequestDTO } from "../../../dto/auth/request.dto";

export interface IArtistVerifyEmailUsecase {
    execute(request: VerifyEmailRequestDTO): Promise<void>;
}