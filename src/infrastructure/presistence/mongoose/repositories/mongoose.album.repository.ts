import { ClientSession, FilterQuery } from "mongoose";
import { Album, AlbumWithSongs } from "../../../../domain/entities/album.entity";
import { IAlbumRepository, PaginaterAlbumResult } from "../../../../domain/repositories/album.repository";
import { AlbumModel } from "../models/album.model";
import { GetAllAlbumsRequest } from "../../../../domain/interfaces/albumRequest";
import { EditAlbumDetailsDTO } from "../../../../application/dto/album/album.dto";
import { SongNew } from "../../../../domain/entities/song.entity";

export class MongooseAlbumRepository implements IAlbumRepository {
    async create(albumData: Album, session: ClientSession): Promise<Album> {
        const album = new AlbumModel(albumData)

        const createdAlbum = await album.save({session})
        return createdAlbum.toObject()
    }

    async getAll(): Promise<Album[]> {
           const songs = await AlbumModel.find({isActive: true})
           return songs
    }

    async findById(id: string): Promise<AlbumWithSongs | null> {
        const filter: FilterQuery<Album> = { 
                    _id: id, 
                    isActive: true 
                };
        return await AlbumModel.findOne(filter)
        .populate<{songs: SongNew[]}>("songs")
        .lean().exec()
    }

    async getDetails(albumId: string): Promise<EditAlbumDetailsDTO | null> {
        const album = await AlbumModel.findById(albumId)
                .select("_id coverImagePublicId")
                .lean()
                .exec();
        
        if (!album) return null;
        
        return {
            id: album._id.toString(),
            coverImagePublicId: album.coverImagePublicId
        };
    }

    async getAlbumsByIds(albumIds: string[]): Promise<Album[]> {
        return AlbumModel.find({ _id: { $in: albumIds } })
            .populate("songs", "_id");
    }

    async find(albumId: string): Promise<Album | null> {
        return await AlbumModel.findById(albumId)
        .populate("songs")  
        .lean();
    }

    async updateById(albumId: string, data: Partial<Album>, session?: ClientSession): Promise<Album | null> {
        const updatedAlbum = await AlbumModel.findByIdAndUpdate(albumId,
            {$set: data},
            {new: true, session}
        ).lean().exec()

        return updatedAlbum
    }

    async removeSongFromAllAlbums(songId: string, session: ClientSession): Promise<void> {
        await AlbumModel.updateMany(
            {songs: songId},
            {$pull: {songs: songId}},
            {session}
        ).exec()
    }

    async delete(albumId: string, session: ClientSession): Promise<boolean> {
        const album = await AlbumModel.findByIdAndDelete(albumId).session(session)
        return album !== null
    }

    async countDocuments(): Promise<number> {
        return await AlbumModel.countDocuments()
    }

    async updateSongTitleInAlbums(songId: string, newTitle: string, session: ClientSession): Promise<void> {
        await AlbumModel.updateMany(
            {songs: songId},
            {$set: {"songTitles.$": newTitle}},
            {session}
        ).exec()
    }

    async removeSongTitleFromAllAlbums(songTitle: string, session: ClientSession): Promise<void> {
        await AlbumModel.updateMany(
            {songTitles: songTitle},
            {$pull: {songTitles: songTitle}},
            {session}
        ).exec()
    }

    async getAllAlbum(page: number, limit: number, query?: string): Promise<PaginaterAlbumResult> {
        const skip = (page - 1) * limit;
        
        // Search filter 
        const filter = query ? { title: { $regex: query, $options: 'i' } } : {};

        const [albums, total] = await Promise.all([
            AlbumModel.find(filter).skip(skip).limit(limit).lean().exec(),
            AlbumModel.countDocuments(filter)
        ]);

        return { albums: albums as unknown as Album[], total };
    }

    async admingetAllAlbums(params: GetAllAlbumsRequest): Promise<PaginaterAlbumResult> {
        const { page, limit, search, status, sort } = params;
        const skip = (page - 1) * limit;

        const filter: FilterQuery<Album> = {}; 

        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }

        if (status && status !== 'all') {
            filter.isActive = status === 'active'; 
        }

        let sortOption = {};
        if (sort === 'newest') sortOption = { createdAt: -1 };
        else if (sort === 'az') sortOption = { title: 1 };
        else if (sort === 'za')sortOption = {title: -1};
        else if (sort === 'popularity') sortOption = { totalStreams: -1 };
        else sortOption = { createdAt: -1 }; 

        const [albums, total] = await Promise.all([
            AlbumModel.find(filter)
                .select('title artistName coverImageUrl songs isActive createdAt')
                .sort(sortOption)
                .skip(skip)
                .limit(limit)
                .lean(),
            AlbumModel.countDocuments(filter)
        ]);

        return { albums, total };
    }

    async adminFindById(id: string): Promise<AlbumWithSongs | null> {
        const album = await AlbumModel.findById(id)
            .select('_id title artistName coverImageUrl description isActive createdAt songs')
            .populate<{songs: SongNew[]}>({
                path: 'songs',
                model: 'Song',
                select: 'title status uploadId audioKey coverImageKey lyricsKey' 
            })
            .lean()
            .exec();

        return album as AlbumWithSongs | null
    }

    async updateStatus(id: string, status: boolean): Promise<Album | null> {
        return await AlbumModel.findByIdAndUpdate(
            id, 
            { isActive:status }, 
            { new: true , runValidators: true }
        ).lean();
    }

    async updateSongPlayCount(songId: string): Promise<void> {
        await AlbumModel.updateMany(
            {songs: songId},
            {$inc : {playCount: 1}}
        )
    }
}