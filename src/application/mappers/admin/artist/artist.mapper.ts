import { Artist } from "../../../../domain/entities/arist.entity";


export class ArtistMapper {
    static toTableRow(artist: Artist) {
        return {
            id: artist._id!,
            name: artist.name!,
            email: artist.email!,
            profilePicture: artist.profilePicture!,
            status: artist.status!,
            joinDate: new Date(artist.createdAt!)
                .toISOString()
                .split("T")[0],
            followersCount: artist.followersCount ?? 0,
            songsCount: artist.songs?.length ?? 0
        };
    }

    static toTableRows(artists: Artist[]) {
        return artists.map(this.toTableRow);
    }
}
