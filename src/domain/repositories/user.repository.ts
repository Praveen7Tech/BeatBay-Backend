
import { ClientSession } from "mongoose";
import { Artist } from "../entities/arist.entity";
import { User } from "../entities/user.entity";
import { IBaseRepository } from "./base.repository";

export interface IUserRepository extends IBaseRepository<User> {
    isFollowing(followId: string, targetId: string, role: string): Promise<boolean>;
    following(userId: string): Promise<Artist[] | []>
    addPlayList(userId: string, playListId: string, session?: ClientSession): Promise<void>;
    findPlayListByUser(id: string): Promise<User | null>
    getUserProfileDetails(userId: string): Promise< User | null>;
    toggleFollow(followId: string, targetId: string,role: string,action: string): Promise<void>
    getMutualFriends(userId: string): Promise<User[]>
}   