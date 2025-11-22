
import { ClientSession } from "mongoose";
import { Artist } from "../entities/arist.entity";
import { User } from "../entities/user.entity";
import { IBaseRepository } from "./base.repository";

export interface IUserRepository extends IBaseRepository<User> {
    isFollowing(userId: string, artistId: string): Promise<boolean>;
    addFollow(userId: string, artistId: string): Promise<void>;
    removeFollow(userId: string, artistId: string): Promise<void>;
    following(userId: string): Promise<Artist[] | []>
    addPlayList(userId: string, playListId: string, session?: ClientSession): Promise<void>;
    findPlayListByUser(id: string): Promise<User | null>
}