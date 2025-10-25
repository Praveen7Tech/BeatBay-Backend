import { Artist } from "../entities/arist.entity";
import { IBaseRepository } from "./base.repository";

export interface IArtistRepository extends IBaseRepository<Artist> {
    findByUserId(userId: string): Promise<Artist | null>
}