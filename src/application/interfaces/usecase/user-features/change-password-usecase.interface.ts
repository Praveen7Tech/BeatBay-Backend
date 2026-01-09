import { ChangePasswordRequestDTO } from "../../../dto/profile/profile.dto";

export interface IChangePasswordUsecase {
    execute(userId: string, request: ChangePasswordRequestDTO): Promise<{ success: boolean }>;
}