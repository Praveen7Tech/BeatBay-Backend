import { ClientSession, FilterQuery } from "mongoose";
import { Song } from "../../../../domain/entities/song.entity";
import { CreateSongData, ISongRepository } from "../../../../domain/repositories/song.repository";
import { SongModel } from "../models/song.model";
import { GetAllSongsRequest } from "../../../../domain/interfaces/songRequest";
import { AlbumModel } from "../models/album.model";

export class MongooseSongRepository implements ISongRepository{
    async create(songData: CreateSongData, session?:ClientSession): Promise<Song> {
        const Song = new SongModel(songData)

        const cretedSong = await Song.save({session})
        return cretedSong.toObject() 
    }

    async getAll(): Promise<Song[]> {
        const songs = await SongModel.find({status:true})
        return songs
    }

    async findById(id: string): Promise<Song | null> {
        const filter: FilterQuery<Song> = { 
            _id: id, 
            status: true 
        };
        
        return SongModel.findOne(filter)
            .populate({
                path: 'artistId',
                select: 'name profilePicture',
                model: 'Artist'
            })
            .lean<Song>() 
            .exec();
    }

    async songHydration(id: string): Promise<Song | null> {
        // 1. Check if the song exists and is active
        const song = await SongModel.findOne({ _id: id, status: true })
            .populate({
                path: 'artistId',
                select: 'name profilePicture',
                model: 'Artist'
            })
            .lean<Song>()
            .exec();

        if (!song) return null;

        const blockedAlbum = await AlbumModel.findOne({
            songs: id,         // check if song ID is in the 'songs' array
            isActive: false    // The album is blocked
        }).select('_id').lean();

        if (blockedAlbum) {
            console.log(`Access Denied: Song ${id} belongs to Blocked Album ${blockedAlbum._id}`);
            return null; // Return null so the player removes the song
        }

        return song;
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

    async getAllSongs(page: number, limit: number, query?: string): Promise<{songs: Song[], total: number}> {
    const skip: number = (page - 1) * limit;
    
    // Define a type-safe filter object using the Song interface
     const filter: FilterQuery<Song> = { status: true };

        if (query) {
            filter.$or = [
                { title: { $regex: query, $options: 'i' } },
                { artistName: { $regex: query, $options: 'i' } }
            ];
        }

        const [songs, total] = await Promise.all([
            SongModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean<Song[]>() 
                .exec(),
            SongModel.countDocuments(filter)
        ]);

        return { 
            songs: songs, 
            total 
        };
    }

    // admin song listing
    async admingetAllSongs(params: GetAllSongsRequest): Promise<{ songs: Song[], total: number }> {
        const { page, limit, search, status, genre, sort } = params;
        const skip = (page - 1) * limit;

        const filter: any = {};

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { artistName: { $regex: search, $options: 'i' } }
            ];
        }

        //  handle Status  Convert string from frontend to boolean
        if (status && status !== 'all') {
            // map frontend strings to boolean schema
            if (status === 'active' || status === 'published') {
                filter.status = true;
            } else if (status === 'blocked' || status === 'draft') {
                filter.status = false;
            }
        }

        // 3. Handle Genre
        if (genre && genre !== 'all') {
            filter.genre = genre;
        }

        // 4. Handle Sort
        let sortOption: any = { createdAt: -1 };
        if (sort === 'popularity') sortOption = { likesCount: -1 };
        if (sort === 'az') sortOption = { title: 1 };
        if (sort === 'za') sortOption = { title: -1 };

        const [songs, total] = await Promise.all([
            SongModel.find(filter)
                .select('title genre coverImageUrl duration status likesCount createdAt') 
                .sort(sortOption)
                .skip(skip)
                .limit(limit)
                .lean(),
            SongModel.countDocuments(filter)
        ]);

        return { songs, total };
    }

    async updateStatus(id: string, status: boolean): Promise<Song | null> {
        return await SongModel.findByIdAndUpdate(
            id,
            { status: status }, 
            { new: true, runValidators: true }
        ).lean();
    }

    async adminfindById(id: string): Promise<Song | null> {
         return SongModel.findById(id)
        .lean().exec()
    }
}