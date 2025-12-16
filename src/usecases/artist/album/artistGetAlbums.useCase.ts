import { Album } from "../../../domain/entities/album.entity";
import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { AlbumResponseDTO, ArtistAlbumsResponseDTO } from "../../../application/dto/album/album.response.dto";

export class artistGetAlbumsUseCase {
    constructor(
        private readonly _artistRepository: IArtistRepository,
        private readonly _albumRepository: IAlbumRepository
    ) {}

    async execute(artistId: string): Promise<ArtistAlbumsResponseDTO> {

        // Fetch album IDs from artist
        const albumIds = await this._artistRepository.fetchAlbums(artistId);

        //  Fetch full album objects
        const albums = await this._albumRepository.getAlbumsByIds(albumIds);

        //  Format to match DTO
        const formattedAlbums: AlbumResponseDTO[] = albums.map((album: Album) => ({
            id: album._id,
            name: album.title,               
            coverImageUrl: album.coverImageUrl,
            totalSongs: album.songs.length,
            createdAt: album.createdAt
        }));

        const totalSongs = albums.reduce(
            (sum: number, album: Album) => sum + album.songs.length, 
            0
        );

        return {
            artistId,
            totalAlbums: albums.length,
            totalSongs,
            albums: formattedAlbums
        };
    }
}
