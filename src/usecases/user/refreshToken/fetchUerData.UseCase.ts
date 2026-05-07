import { FetchUserDTO } from "../../../application/dto/auth/response.dto";
import { IFetchUserDataUseCase } from "../../../application/interfaces/usecase/refreshToken/fetchUserData.UseCase.interface";
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { IUserRepository } from "../../../domain/repositories/user.repository";

export class FetchUserDataUseCase implements IFetchUserDataUseCase{
    constructor(
        private readonly _userRepository: IUserRepository
    ){}

    async execute(userId: string): Promise<FetchUserDTO> {
        const user = await this._userRepository.findById(userId)

        if(!user){
            throw new NotFoundError("user not found!")
        }

        return{
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture || "",
        }
    }
}