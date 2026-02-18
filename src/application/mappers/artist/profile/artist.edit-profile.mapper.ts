
import { Artist } from "../../../../domain/entities/arist.entity";
import { ProfileResponse } from "../../../dto/artist/artist.profile.dto";

export class ArtistEditProfileMapper{
    static toResponse(artist:Artist): ProfileResponse{
        return {
            id: artist._id.toString(),
            name: artist.name,
            profilePicture: artist.profilePicture || ""
        }
    }
}