import { Song } from "../../../domain/entities/song.entity";
import { IRecomentationService } from "../../../domain/services/recomentation.service";
import { SongModel } from "../../presistence/mongoose/models/song.model";

export class SongRecommentationService implements IRecomentationService{
    async getRecomentedSongs(songId: string, artistId: string, genre: string): Promise<Song[]> {
        
        const limit = 10
        const currentSongId = songId

        const artistSongs = await SongModel.find({
            artistId: artistId,
            _id:{$ne: songId}
        }).limit(limit).exec()

        const playedSongIds = artistSongs.map(song=> song._id.toString())
        playedSongIds.push(currentSongId)

        const genreSongs = await SongModel.find({
            genre: genre,
            _id:{$nin: playedSongIds}
        }).limit(limit).exec()

        const recomentations : Song[] = [...artistSongs, ...genreSongs]

        return recomentations
    }
}