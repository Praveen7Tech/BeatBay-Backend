import { Artist } from "../entities/arist.entity";
import { User } from "../entities/user.entity";
import { IBaseRepository } from "./base.repository";

export interface IArtistRepository extends IBaseRepository<Artist> {
    findByUserId(userId: string): Promise<Artist | null>
    updatePass(email: string, entity: Partial<User>): Promise<User | null>
    findByEmail(email: string): Promise<Artist | null>
    update(id: string, entity: Partial<Artist>): Promise< Artist | null>
}