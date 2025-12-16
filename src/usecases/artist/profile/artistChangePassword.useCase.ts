
import { IPasswordService } from "../../../domain/services/password.service"; 
import { ChangePasswordRequestDTO } from "../../../application/dto/profile/profile.dto"; 
import { IncorrectPasswordError, NotFoundError } from "../../../common/errors/common/common.errors";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";

export class ArtistChangePasswordUsecase {
    constructor(
        private readonly _passwordService: IPasswordService,
        private readonly _artistRepository: IArtistRepository,
    ) {}

    async execute(artistId: string, request: ChangePasswordRequestDTO): Promise<{ success: boolean }> {
        const { currentPassword, newPassword } = request;

        const artist = await this._artistRepository.findById(artistId);
        if (!artist ) {
            throw new NotFoundError("artist not found")
        }
        if(!artist.password){
            throw new NotFoundError("This accound created using email id.")
        }

        const isMatch = await this._passwordService.compare(currentPassword, artist.password);

        if (!isMatch) {
            throw new IncorrectPasswordError(); 
        }

        const hashedPassword = await this._passwordService.hash(newPassword);
        
        await this._artistRepository.update(artistId, { password: hashedPassword });

        return { success: true };
    }
}
