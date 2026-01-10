import { IAlbumRepository } from "../../../domain/repositories/album.repository";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { ISongRepository } from "../../../domain/repositories/song.repository";
import { ITransactionManager } from "../../../domain/services/transaction.service";
import { CreateAlbumDTO } from "../../../application/dto/album/album.dto";
import { ArtistCreateAlbumMapper } from "../../../application/mappers/artist/album/create-album.mapper";
import { IArtistCreateAlbumUseCase } from "../../../application/interfaces/usecase/album/artist-create-album-usecase.interface";

export class ArtistCreateAlbumUseCase implements IArtistCreateAlbumUseCase{
  constructor(
    private readonly _albumRepository: IAlbumRepository,
    private readonly _transactionManager: ITransactionManager,
    private readonly _artistRepository: IArtistRepository,
    private readonly _songRepository: ISongRepository
  ) {}

  async execute(artistId: string,request: CreateAlbumDTO ): Promise<{ success: boolean }> {

    await this._transactionManager.withTransaction(async session => {
      const artist = await this._artistRepository.findById(artistId);
      if (!artist) throw new Error("Artist not found.");

      const songs = await this._songRepository.findSongsByIds(request.songs);

      const albumData = ArtistCreateAlbumMapper.toAlbumPersistence(
          artistId,
          artist.name,
          request,
          songs
        );

      const newAlbum = await this._albumRepository.create(albumData, session);

      await this._artistRepository.addAlbumIdToArtist(
        artistId,
        newAlbum._id,
        session
      );
    });

    return { success: true };
  }
}
