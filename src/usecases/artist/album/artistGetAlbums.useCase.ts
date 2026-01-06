import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import {  ArtistAlbumsResponseDTO } from "../../../application/dto/album/album.response.dto";
import { ArtistAlbumMapper } from "../../../application/mappers/artist/album/artist-album.mapper";

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
        return {
            artistId,
            totalAlbums: albums.length,
            totalSongs: albums.reduce((sum, a) => sum + a.songs.length, 0),
            albums: albums.map(ArtistAlbumMapper.toAlbumResponseDTO)
        };
    }
}
