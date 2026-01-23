import { FollowerUser, FollowerWithUser } from "../../../../domain/entities/follower.entity";
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
                    .populate<{ followerId: FollowerUser }>({
                        path: "followerId",
                        select: "name role profilePicture createdAt" 
                    })
                    .lean()
                    .exec(),
                FollowerModel.countDocuments({ targetId })
            ]);

            const populatedDocs = docs as FollowerWithUser[]
            
            const followers: FollowerPreview[] = populatedDocs.map((doc)=>({
                id: doc.followerId._id.toString(),
                name: doc.followerId.name,
                role: doc.followerId.role,
                profilePicture: doc.followerId.profilePicture,
                createdAt: doc.followerId.createdAt
            }))

        return { followers, total };
    }
}