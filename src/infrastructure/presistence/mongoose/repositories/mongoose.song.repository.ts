import { ClientSession, FilterQuery } from "mongoose";
import { Song } from "../../../../domain/entities/song.entity";
import { CreateSongData, ISongRepository } from "../../../../domain/repositories/song.repository";
import { SongModel } from "../models/song.model";
import { GetAllSongsRequest } from "../../../../domain/interfaces/songRequest";

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
            status: true // This will now be strictly enforced
        };
        
        // CHANGE: Use findOne instead of findById to support multiple filters
        return SongModel.findOne(filter)
            .populate({
                path: 'artistId',
                select: 'name profilePicture',
                model: 'Artist'
            })
            .lean<Song>() 
            .exec();
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

        // 1. Handle Search
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { artistName: { $regex: search, $options: 'i' } }
            ];
        }

        // 2. Handle Status (Crucial Fix: Convert string from frontend to boolean)
        if (status && status !== 'all') {
            // Map frontend strings to your boolean schema
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