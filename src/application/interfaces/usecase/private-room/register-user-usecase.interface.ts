import { RegisterUserResponseDTO } from "../../../dto/private-room/register-user.dto";

export interface IRegisterUserUseCase{
    execute(serId: string): Promise<RegisterUserResponseDTO>
}