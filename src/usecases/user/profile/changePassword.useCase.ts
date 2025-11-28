
import { IPasswordService } from "../../../domain/services/password.service"; 
import { IUserRepository } from "../../../domain/repositories/user.repository"; 
import { ChangePasswordRequestDTO } from "../../dto/profile/profile.dto"; 
import { IncorrectPasswordError, NotFoundError } from "../../../common/errors/common/common.errors";

export class ChangePasswordUsecase {
    constructor(
        private readonly passwordService: IPasswordService,
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(userId: string, request: ChangePasswordRequestDTO): Promise<{ success: boolean }> {
        const { currentPassword, newPassword } = request;

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError("User not found")
        }

        if(!user.password){
            throw new NotFoundError("This accound logged using email id.")
        }

        const isMatch = await this.passwordService.compare(currentPassword, user.password);

        if (!isMatch) {
            throw new IncorrectPasswordError(); 
        }

        const hashedPassword = await this.passwordService.hash(newPassword);
        
        await this.userRepository.update(userId, { password: hashedPassword });

        return { success: true };
    }
}
