import { Song } from "../../../domain/entities/song.entity";
import { IRecomentationService } from "../../../domain/services/recomentation.service";
import { LikeModel } from "../../presistence/mongoose/models/likes.model";
import { SongModel } from "../../presistence/mongoose/models/song.model";

export class SongRecommentationService implements IRecomentationService{
    async getRecomentedSongs(songId: string, artistId: string, genre: string, userId: string): Promise<{ song: Song; isLiked: boolean }[]> {
        
        const limit = 10
        const currentSongId = songId

        const artistSongs = await SongModel.find({
            artistId: artistId,
            _id:{$ne: songId},
            status: true
        })
        .populate({
            path:'artistId',
            select: 'name profilePicture',
            model: 'Artist'
        })
        .lean()
        .limit(limit).exec()

        const playedSongIds = artistSongs.map(song=> song._id.toString())
        playedSongIds.push(currentSongId)

        const genreSongs = await SongModel.find({
             genre: genre,
            _id:{$nin: playedSongIds},
            status: true
        })
        .populate({
            path:'artistId',
            select: 'name profilePicture',
            model: 'Artist'
        })
        .lean()
        .limit(limit).exec()

        const songs : Song[] = [...artistSongs, ...genreSongs]

        // update each song the user liked or not
        let likedSet = new Set<string>();

        if (userId && songs.length > 0) {
            const likes = await LikeModel.find({
            userId,
            songId: { $in: songs.map(s => s._id) },
            }).select("songId");

            likedSet = new Set(likes.map(l => l.songId.toString()));
        }

        return songs.map(song => ({
            song,
            isLiked: likedSet.has(song._id.toString()),
        }));
    }
}