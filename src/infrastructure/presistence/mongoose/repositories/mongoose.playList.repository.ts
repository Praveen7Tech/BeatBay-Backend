import { ClientSession, HydratedDocument } from "mongoose";
import { PlayList } from "../../../../domain/entities/playList.entiy";
import { IPlayListRepository } from "../../../../domain/repositories/playList.repository";
import { PlayListModel } from "../models/playList.model";

export class  MongoosePlayListRepository implements IPlayListRepository{
    async create(plalistData: PlayList, session: ClientSession): Promise<PlayList> {
        const playList = new PlayListModel(plalistData)

        const savedPlaylist = await playList.save({session});
        return savedPlaylist.toObject();
    }

    async findById(playListId: string): Promise<PlayList | null> {
        const playList = await PlayListModel.findById(playListId)
        .populate("songs")
        .lean().exec()

        return playList
    }

    async findByUserId(userId: string): Promise<PlayList | null> {
        const playLists = await PlayListModel.findById(userId).lean()

        return playLists
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
}