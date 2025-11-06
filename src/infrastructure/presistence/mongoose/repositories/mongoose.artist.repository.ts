import { Artist } from "../../../../domain/entities/arist.entity";
import { IArtistRepository } from "../../../../domain/repositories/artist.repository";
import { ArtistModel } from "../models/artist.model"; 

export class MongooseArtistRepository implements IArtistRepository {
    constructor(){}

    async create(entity: Artist): Promise<Artist> {
        const artist = new ArtistModel(entity);
   
        const createdArtist = await artist.save();
        return createdArtist.toObject();     
    }

     async findById(id: string): Promise<Artist | null> {
        return ArtistModel.findById(id).lean();
      }
    
      
      async update(_id: string, entity: Partial<Artist>): Promise<Artist | null> {
        return ArtistModel.findOneAndUpdate({ _id }, entity, { new: true }).lean();
      }
    

      async findByEmail(email: string): Promise<Artist | null> {
        return ArtistModel.findOne({ email }).lean();
      }
    
      
}
