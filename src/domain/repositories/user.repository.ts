
import { ClientSession } from "mongoose";
import { User } from "../entities/user.entity";
import { IBaseRepository } from "./base.repository";
import { FollowedEntity } from "../interfaces/following";
import { DemoGraphics } from "../../application/dto/admin/dashboard/dashboard.dto";

export interface IUserRepository extends IBaseRepository<User> {
    isFollowing(followId: string, targetId: string, role: string): Promise<boolean>;
    following(userId: string, page: number, limit: number): Promise<{ docs: FollowedEntity[], total: number }>
    addPlayList(userId: string, playListId: string, session?: ClientSession): Promise<void>;
    findPlayListByUser(id: string): Promise<User | null>
    getUserProfileDetails(userId: string): Promise< User | null>;
    toggleFollow(followId: string, targetId: string,role: string,action: string): Promise<void>
    getMutualFriends(userId: string): Promise<User[]>
    getUserStatistics(startDate: Date): Promise<DemoGraphics[]>
}   