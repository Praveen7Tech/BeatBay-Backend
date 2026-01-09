import { ResetPasswordDTO } from "../../dto/auth/request.dto";

export interface IResetPasswordUsecase {
    execute(request: ResetPasswordDTO): Promise<void>;
}