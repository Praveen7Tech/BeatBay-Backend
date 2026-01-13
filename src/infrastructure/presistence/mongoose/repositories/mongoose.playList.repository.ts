import { ClientSession, HydratedDocument } from "mongoose";
import { PlayList } from "../../../../domain/entities/playList.entiy";
import { IPlayListRepository } from "../../../../domain/repositories/playList.repository";
import { PlayListModel } from "../models/playList.model";
import { playListProjection } from "../../../../domain/interfaces/playlist.interface";
import { PlayListEditDTO } from "../../../../application/dto/playList/edit.playlist.dto";

export class  MongoosePlayListRepository implements IPlayListRepository{
    async create(plalistData: PlayList, session: ClientSession): Promise<PlayList> {
        const playList = new PlayListModel(plalistData)

        const savedPlaylist = await playList.save({session});
        return savedPlaylist.toObject();
    }

   async getDetails(playListId: string): Promise<PlayListEditDTO | null> {
        const playlist = await PlayListModel.findById(playListId)
            .select("_id coverImagePublicId")
            .lean()
            .exec();

        if (!playlist) return null;

        return {
            id: playlist._id.toString(),
            coverImagePublicId: playlist.coverImagePublicId
        };
    }



    async findById(playListId: string): Promise<PlayList | null> {
        const playList = await PlayListModel.findById(playListId)
        .populate("songs")
        .lean().exec()

        return playList
    }

    async findByUserId(userId: string): Promise<playListProjection[]> {
        const playlists = await PlayListModel.find({userId: userId})
        .select("_id name coverImageUrl").lean().exec()

        return playlists
    }

    async update(playListId: string, songId: string): Promise<void> {
        await PlayListModel.findByIdAndUpdate(playListId,{
            $addToSet:{songs: songId}
        }).lean().exec()

    }

    async edit(playListId: string, entity: Partial<PlayList>): Promise<PlayList | null> {
        const playlist = await PlayListModel.findByIdAndUpdate(
            playListId,
            { $set: entity }, 
            { new: true }     
        ).lean().exec();

        return playlist ? playlist  : null;
    }

    async removeSongFromAllPlaylists(songId: string, session: ClientSession): Promise<void> {
        await PlayListModel.updateMany(
            {songs: songId},
            {$pull: {songs: songId}},
            {session}
        ).exec()
    }

    async removeSong(playlistId: string, songId: string): Promise<void> {
        await PlayListModel.findByIdAndUpdate(playlistId,{
            $pull: {songs:songId}
        })
        .lean().exec()
    }

    async delete(playlistId: string): Promise<boolean> {
        const playlist = await PlayListModel.findByIdAndDelete(playlistId)
        return !!playlist
    }
}