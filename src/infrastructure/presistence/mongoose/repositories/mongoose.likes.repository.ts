import { IMongooseLikesRepository } from "../../../../domain/repositories/Likes.repository";
import { LikeModel } from "../models/likes.model";
import { SongModel } from "../models/song.model";

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
}