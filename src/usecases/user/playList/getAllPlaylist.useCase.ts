import { NotFoundError } from "../../../common/errors/common/common.errors";
import { PlayList } from "../../../domain/entities/playList.entiy";
import { IPlayListRepository } from "../../../domain/repositories/playList.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";

export class GetAllPlaylistUseCase{
    constructor(
        private readonly userRepository: IUserRepository
    ){}

    async execute(userId: string): Promise<PlayList[] | []>{
        const user = await this.userRepository.findPlayListByUser(userId);
 
        if(!user){
            throw new NotFoundError("User not found")
        }

        const playLists = user.playLists

        return playLists
    }
}