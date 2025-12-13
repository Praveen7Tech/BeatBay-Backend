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
        return SongModel.findById(id)
        .populate({
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
            ]
        }

        const song = await SongModel
        .find(SearchQury)
        .skip(offset)
        .limit(limit)

        return song

    }

     async edit(songId: string, data: Partial<Song>, session?: ClientSession): Promise<Song | null> {
        const updatedSong = await SongModel.findByIdAndUpdate(
            songId,
            { $set: data }, // Use $set to update only the fields provided in the 'data' object
            { new: true },   // Return the updated document
        ).lean().exec();

        return updatedSong ? (updatedSong as unknown as Song) : null;
    }

    async delete(songId: string, session: ClientSession): Promise<boolean> {
        const song = await SongModel.findByIdAndDelete(songId).session(session)
        return song !== null
    }

    async countDocuments(): Promise<number> {
        return await SongModel.countDocuments()
    }

    async findSongsByIds(ids: string[]): Promise<Song[]> {
        const songs = await SongModel.find(
            { _id: { $in: ids } }
        ).lean().exec();
        return songs as Song[];
    }
}