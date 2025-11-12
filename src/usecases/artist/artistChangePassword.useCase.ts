
import { IPasswordService } from "../../domain/services/password.service"; 
import { ChangePasswordRequestDTO } from "../dto/profile/profile.dto"; 
import { IncorrectPasswordError, NotFoundError } from "../../common/errors/common/common.errors";
import { IArtistRepository } from "../../domain/repositories/artist.repository";

export class ArtistChangePasswordUsecase {
    constructor(
        private readonly passwordService: IPasswordService,
        private readonly artistRepository: IArtistRepository,
    ) {}

    async execute(artistId: string, request: ChangePasswordRequestDTO): Promise<{ success: boolean }> {
        const { currentPassword, newPassword } = request;

        const artist = await this.artistRepository.findById(artistId);
        if (!artist ) {
            throw new NotFoundError("artist not found")
        }
        if(!artist.password){
            throw new NotFoundError("This accound created using email id.")
        }

        const isMatch = await this.passwordService.compare(currentPassword, artist.password);

        if (!isMatch) {
            throw new IncorrectPasswordError(); 
        }

        const hashedPassword = await this.passwordService.hash(newPassword);
        
        await this.artistRepository.update(artistId, { password: hashedPassword });

        return { success: true };
    }
}
