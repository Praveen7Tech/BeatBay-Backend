
import { User } from "../entities/user.entity";
import { IBaseRepository } from "./base.repository";

export interface IUserRepository extends IBaseRepository<User> {
    isFollowing(userId: string, artistId: string): Promise<boolean>;
    addFollow(userId: string, artistId: string): Promise<void>;
    removeFollow(userId: string, artistId: string): Promise<void>;
}