import { Artist } from "../../../../domain/entities/arist.entity";
import { IArtistRepository } from "../../../../domain/repositories/artist.repository";
import { ArtistModel } from "../models/artist.model"; 
import { ClientSession } from 'mongoose';

export class MongooseArtistRepository implements IArtistRepository {
    constructor(){}

    async create(entity: Artist, session?: ClientSession): Promise<Artist> {
        const artist = new ArtistModel(entity);
   
        const createdArtist = await artist.save({session});
        return createdArtist.toObject();     
    }
    
    async findByUserId(userId: string): Promise<Artist | null> {
        const artistDoc = await ArtistModel.findOne({ userId });
        return artistDoc ? artistDoc.toObject() : null;
    }

     async findById(id: string): Promise<Artist | null> {
        return ArtistModel.findById(id).lean();
      }
    
      
      async update(email: string, entity: Partial<Artist>): Promise<Artist | null> {
        return ArtistModel.findOneAndUpdate({ email }, entity, { new: true }).lean();
      }
    
      async findAll(): Promise<Artist[]> {
         throw new Error('Method not implemented.');
      }
    
      async delete(id: string): Promise<boolean> {
        throw new Error('Method not implemented.');
      }
}
