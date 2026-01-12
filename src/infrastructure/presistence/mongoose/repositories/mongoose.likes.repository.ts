import mongoose from "mongoose";
import { IMongooseLikesRepository, LikedSongsResponseData } from "../../../../domain/repositories/Likes.repository";
import { LikeModel } from "../models/likes.model";
import { SongModel } from "../models/song.model";
import { LikedSongDetails } from "../../../../application/dto/favorites/favourites.response.dto";

export class MongooseLikesRepository implements IMongooseLikesRepository{

    async toggleLike(songId: string, userId: string): Promise<boolean> {
        const existLike = await LikeModel.findOne({songId, userId})

        if(existLike){
            await LikeModel.deleteOne({_id: existLike._id})
            await SongModel.findByIdAndUpdate(songId,
                {$inc:{likesCount: -1}}
            )
            return false
        }else{
            await LikeModel.create({songId, userId})
            await SongModel.findByIdAndUpdate(songId,
                {$inc:{likesCount: 1}}
            )
            return true
        }
    }

    async likedSongs(userId: string, page: number): Promise<LikedSongsResponseData> {
        const limit = 10;
        const skip = (page - 1) * limit;
        const uid = new mongoose.Types.ObjectId(userId);

        const totalCount = await LikeModel.countDocuments({ userId: uid });

        const likedSongs: LikedSongDetails[] = await LikeModel.aggregate([
            { $match: { userId: uid } },
            { $sort: { createdAt: -1 } }, 
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                from: "songs",
                localField: "songId",
                foreignField: "_id",
                as: "songDetails",
                },
            },
            { $unwind: "$songDetails" },
            {
                $project: {
                _id: 1,
                createdAt: 1, 
                songDetails: 1,
                },
            },
        ]);

        return { songs: likedSongs, totalCount };
    }
}