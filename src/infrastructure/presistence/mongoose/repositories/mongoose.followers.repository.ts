import { FollowerPreview } from "../../../../domain/interfaces/following";
import { IFollowersRepository } from "../../../../domain/repositories/followers.repository";
import { FollowerModel } from "../models/followers.model";

export class MongooseFolloersRepository implements IFollowersRepository{
    async getFollowersList(targetId: string, page: number, limit: number): Promise<{ followers: FollowerPreview[]; total: number; }> {
        const skip = (page - 1) * limit;
        
            const [docs, total] = await Promise.all([
                FollowerModel.find({ targetId })
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 }) 
                    .populate<{ followerId: any }>({
                        path: "followerId",
                        select: "name role profilePicture" 
                    })
                    .lean()
                    .exec(),
                FollowerModel.countDocuments({ targetId })
            ]);
            
            const followers: FollowerPreview[] = docs.map((doc)=>({
                id: doc.followerId._id.toString(),
                name: doc.followerId.name,
                role: doc.followerId.role,
                profilePicture: doc.followerId.profilePicture
            }))

        return { followers, total };
    }
}