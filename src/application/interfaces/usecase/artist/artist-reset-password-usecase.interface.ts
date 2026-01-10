import { ResetPasswordDTO } from "../../../dto/auth/request.dto";

export interface IArtistResetPasswordUsecase {
    execute(request: ResetPasswordDTO): Promise<void>;
}