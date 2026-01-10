import { Song } from "../../../domain/entities/song.entity";
import { IRecomentationService } from "../../../domain/services/recomentation.service";
import { LikeModel } from "../../presistence/mongoose/models/likes.model";
import { SongModel } from "../../presistence/mongoose/models/song.model";

export class SongRecommentationService implements IRecomentationService{
    async getRecomentedSongs(songId: string, artistId: string, genre: string, userId: string): Promise<Song[]> {
        
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

        const recomentations : Song[] = [...artistSongs, ...genreSongs]

        // update each song the user liked or not
        if(userId && recomentations.length > 0){
            const songIds = recomentations.map(song=> song._id)

            const likeRecords = await LikeModel.find({
                userId: userId,
                songId: {$in: songIds}
            })
            .select("songId").lean()

            const likedSet = new Set(likeRecords.map(record=> record.songId.toString()))

            return recomentations.map(song =>({
                ...song,
                isLiked: likedSet.has(song._id.toString())
            }))

        }
        return recomentations.map(song => ({
            ...song,
            isLiked: false
        }))
    }
}