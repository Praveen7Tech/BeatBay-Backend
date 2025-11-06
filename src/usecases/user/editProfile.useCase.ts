
import { User } from "../../domain/entities/user.entity";
import { IPasswordService } from "../../domain/services/password.service";
import { IUserRepository } from "../../domain/repositories/user.repository";
import { EditProfileRequestDTO, EditProfileResponseDTO } from "../dto/profile/profile.dto";
import { NotFoundError } from "../../common/errors/common/common.errors";

export class editProfileUsecase {
    constructor(
        private readonly passwordService: IPasswordService,
        private readonly userRepository: IUserRepository,
    ){}

    async execute(userId: string,request:EditProfileRequestDTO): Promise<EditProfileResponseDTO>{
        const {name, password, profileImage} = request

        const updateData : Partial<User> = {}
        if(name !== undefined) updateData.name = name;
        if(profileImage !== undefined) updateData.profilePicture = profileImage;

        if(password){
            const hashedPassword = await this.passwordService.hash(password)
            updateData.password = hashedPassword
        }

        const updatedUser = await this.userRepository.update(userId,updateData)
        if(!updatedUser) throw new NotFoundError("user not found for update")


        return {user:updatedUser}
    }
}