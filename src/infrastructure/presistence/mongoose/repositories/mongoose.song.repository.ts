import { ClientSession } from "mongoose";
import { Song } from "../../../../domain/entities/song.entity";
import { CreateSongData, ISongRepository } from "../../../../domain/repositories/song.repository";
import { SongModel } from "../models/song.model";

export class MongooseSongRepository implements ISongRepository{
    async create(songData: CreateSongData, session?:ClientSession): Promise<Song> {
        const Song = new SongModel(songData)

        const cretedSong = await Song.save({session})
        return cretedSong.toObject() 
    }

    async getAll(): Promise<Song[]> {
        const songs = await SongModel.find()
        return songs
    }

    async findById(id: string): Promise<Song | null> {
        return SongModel.findById(id).populate({
            path:'artistId',
            select: 'name profilePicture',
            model: 'Artist'
        })
        .lean().exec()
    }

    async searchByQuery(query: string, options?: { limit?: number; offset?: number; }): Promise<Song[]> {
        const {limit = 20, offset = 0} = options || {}
        const SearchQury = {
            $or:[
                {title: {$regex: query, $options: "i"}},
                {artsitName: {$regex: query, $options: "i"}},
                {album : {$regex: query, $options: "i"}}
            ]
        }

        const song = await SongModel
        .find(SearchQury)
        .skip(offset)
        .limit(limit)

        return song

        // return song.map((s)=>({
        //     id:s._id,
        //     title: s.title,
        //     artistName: s.artistId,
        //     duration: s.duration,
        //     coverImageUrl: s.coverImageUrl
        // }))
    }
}