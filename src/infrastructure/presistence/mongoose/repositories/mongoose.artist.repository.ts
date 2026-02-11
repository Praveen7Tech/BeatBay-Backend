import { ClientSession } from "mongoose";
import { Artist } from "../../../../domain/entities/arist.entity";
import { IArtistRepository } from "../../../../domain/repositories/artist.repository";
import { ArtistModel } from "../models/artist.model"; 
import { SongNew } from "../../../../domain/entities/song.entity";
import { PaginatedResult } from "../../../../domain/interfaces/paginatedResult.interface";
import { ArtistPopulated } from "../../../../domain/interfaces/albumRequest";

export class MongooseArtistRepository implements IArtistRepository {

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

      async findArtistDetailsById(id: string): Promise<ArtistPopulated | null> {
        return ArtistModel.findById(id)
          .populate("albums")
          .populate("songs")
          .lean<ArtistPopulated>();
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

      async fetchSongs(artistId: string): Promise<SongNew[]> {
          const Songs = await ArtistModel.findById(artistId).populate('songs').lean()
          return Songs ? Songs.songs as unknown as SongNew[] : []
      }

      async addAlbumIdToArtist(artistId: string, albumId: string, session: ClientSession): Promise<void> {
          await ArtistModel.findByIdAndUpdate(
            artistId,
            {$push:{albums: albumId}},
            {new: true, session}
          )
      }

      async fetchAlbums(artistId: string): Promise<string[]> {
          const artist = await ArtistModel.findById(artistId)
          .select("albums").lean()

          return artist?.albums ?? []
      }

      async removeSongIdFromArtist(artistId: string, songId: string, session: ClientSession): Promise<void> {
          await ArtistModel.findByIdAndUpdate(
            artistId,
            {$pull: {songs: songId}},
            {session}
          ).exec()
      }

      async removeAlbumIdFromArtist(artistId: string, albumId: string, session: ClientSession): Promise<void> {
          await ArtistModel.findByIdAndUpdate(
            artistId,
            {$pull: {albums: albumId}},
            {session}
          ).exec()
      }

      async findAll(page: number, limit: number, search: string): Promise<PaginatedResult<Artist>> {
          const skip = (page-1) * limit
          const filterOption = search ? 
            {
              role: "artist",
              $or:[
                {name: {$regex: search, $options:"i"}},
                {email: {$regex: search, $options:"i"}}
              ]
            }
            :
           {role:"artist"}

          const [data, totalCount] = await Promise.all([
              ArtistModel.find(filterOption).sort({createdAt: -1}).skip(skip).limit(limit).lean(),
              ArtistModel.countDocuments(filterOption)
          ])
          
          return {data, totalCount }
      }

      async blockById(id: string): Promise<boolean> {
          const user = await ArtistModel.findByIdAndUpdate(id,
                {status: false}
          ).lean()
          
        return user !== null
      }

      async unBlockById(id: string): Promise<boolean> {
          const artist = await ArtistModel.findByIdAndUpdate(id,
            {status: true}
          ).lean()

          return artist !== null
      }

      async countDocuments(): Promise<number> {
          return await ArtistModel.countDocuments({role: "artist"})
      }


      async searchByName(query: string): Promise<Artist[] | null> {
            const artist = await ArtistModel.find(
              {name: {$regex: new RegExp(query, 'i')}}
            )
            .limit(10)
            .lean().exec()
      
            return artist
      }

      async getStripeConnectId(artistId: string): Promise<string | null> {
          
        const artist = await ArtistModel.findById(artistId)
        .select("stripeConnectId")

        return artist?.stripeConnectId ?? null
      }


      async updatePayoutStatus(stripeConnectionId: string, status: boolean): Promise<void> {
          
        await ArtistModel.findOneAndUpdate(
          {stripeConnectId:stripeConnectionId},
          {payOutEnabled: status}
        )
      }
      
}
