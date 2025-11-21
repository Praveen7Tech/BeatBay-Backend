import { HydratedDocument } from "mongoose";
import { PlayList } from "../../../../domain/entities/playList.entiy";
import { IPlayListRepository } from "../../../../domain/repositories/playList.repository";
import { PlayListModel } from "../models/playList.model";

export class  MongoosePlayListRepository implements IPlayListRepository{
    async create(name: string): Promise<PlayList> {
        const playList = new PlayListModel({
            name: name,
            songs: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        })

        const savedPlaylist = await playList.save();
        return savedPlaylist.toObject();
    }

    async findById(playListId: string): Promise<PlayList | null> {
        const playList = await PlayListModel.findById(playListId)
        .populate("songs")
        .lean().exec()

        return playList
    }
}