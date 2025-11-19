import { ClientSession } from "mongoose";
import { Artist } from "../../../../domain/entities/arist.entity";
import { IArtistRepository } from "../../../../domain/repositories/artist.repository";
import { ArtistModel } from "../models/artist.model"; 
import { Song } from "../../../../domain/entities/song.entity";
import { Album } from "../../../../domain/entities/album.entity";

export class MongooseArtistRepository implements IArtistRepository {
    constructor(){}

    async create(entity: Artist): Promise<Artist> {
        const artist = new ArtistModel(entity);
   
        const createdArtist = await artist.save();
        return createdArtist.toObject();     
    }

     async findById(id: string): Promise<Artist | null> {
        return ArtistModel.findById(id)
        .populate("songs")
        .populate("albums")
        .lean();
      }
    
      
      async update(_id: string, entity: Partial<Artist>): Promise<Artist | null> {
        return ArtistModel.findOneAndUpdate({ _id }, entity, { new: true }).lean();
      }
    

      async findByEmail(email: string): Promise<Artist | null> {
        return ArtistModel.findOne({ email }).lean();
      }
    
      async addSongIdToArtist(artistId: string, songId: string, session: ClientSession): Promise<void> {
          await ArtistModel.findByIdAndUpdate(
            artistId,
            {$push:{songs: songId}},
            {new: true, session}
          )
      }

      async fetchSongs(artistId: string): Promise<Song[]> {
          const Songs = await ArtistModel.findById(artistId).populate('songs').lean()
          return Songs ? Songs.songs as unknown as Song[] : []
      }

      async addAlbumIdToArtist(artistId: string, albumId: string, session: ClientSession): Promise<void> {
          await ArtistModel.findByIdAndUpdate(
            artistId,
            {$push:{albums: albumId}},
            {new: true, session}
          )
      }

      async fetchAlbums(artistId: string): Promise<Album> {
          const albums = await ArtistModel.findById(artistId).populate('albums').lean().exec()
          return albums?.albums as unknown as Album 
      }
}
