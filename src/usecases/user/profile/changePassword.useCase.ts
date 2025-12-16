
import { IPasswordService } from "../../../domain/services/password.service"; 
import { IUserRepository } from "../../../domain/repositories/user.repository"; 
import { ChangePasswordRequestDTO } from "../../../application/dto/profile/profile.dto"; 
import { IncorrectPasswordError, NotFoundError } from "../../../common/errors/common/common.errors";

export class ChangePasswordUsecase {
    constructor(
        private readonly _passwordService: IPasswordService,
        private readonly _userRepository: IUserRepository,
    ) {}

    async execute(userId: string, request: ChangePasswordRequestDTO): Promise<{ success: boolean }> {
        const { currentPassword, newPassword } = request;

        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError("User not found")
        }

        if(!user.password){
            throw new NotFoundError("This accound logged using email id.")
        }

        const isMatch = await this._passwordService.compare(currentPassword, user.password);

        if (!isMatch) {
            throw new IncorrectPasswordError(); 
        }

        const hashedPassword = await this._passwordService.hash(newPassword);
        
        await this._userRepository.update(userId, { password: hashedPassword });

        return { success: true };
    }
}
