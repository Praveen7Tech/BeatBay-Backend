import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";

export class UserGetSearchDataUseCase{
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _artistRepository: IArtistRepository
    ){}

    async execute(query: string){

        
    }
}