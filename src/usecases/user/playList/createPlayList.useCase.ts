import { IPlayListRepository } from "../../../domain/repositories/playList.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { ITransactionManager } from "../../../domain/services/transaction.service";
import { CreatePlayListResponseDTO } from "../../dto/playList/request.dto";

export class CreatePlayListUseCase{
    constructor(
        private readonly _mongoosePlayListRepository: IPlayListRepository,
        private readonly _transactionManager: ITransactionManager,
        private readonly _userRepository: IUserRepository
    ){}

    async execute(userId:string): Promise<CreatePlayListResponseDTO >{
      
        const createdPlayList = await this._transactionManager.withTransaction(async(session)=>{

            const palyListName = "My PlayList"
            const playListData ={
                userId: userId,
                name: palyListName,
                songs: [],
            }
            const newPlaylist = await this._mongoosePlayListRepository.create(playListData, session)

            await this._userRepository.addPlayList(userId, newPlaylist._id.toString(), session)

            return newPlaylist
        })
        
        if (!createdPlayList) {
                throw new Error("Playlist creation failed inside transaction");
            }

        return {
            id: createdPlayList._id.toString(),
            name: createdPlayList.name,
        };
    }
}