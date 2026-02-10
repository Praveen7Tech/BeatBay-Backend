
import { Artist } from "../../../../domain/entities/arist.entity";
import { ArtistProfileResponse } from "../../../dto/artist/artist.profile.dto";

export class ArtistEditProfileMapper{
    static toResponse(artist:Artist): ArtistProfileResponse{
        return {
            id: artist._id.toString(),
            name: artist.name,
            profilePicture: artist.profilePicture || ""
        }
    }
}