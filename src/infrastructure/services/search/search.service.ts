
import { SearchResult } from "../../../domain/entities/search.entity";
import { AlbumResult, ArtistResult, SongResult, TopResult, UserResult } from "../../../domain/interfaces/search.interface";
import { ISearchService } from "../../../domain/services/search.service";
import { SongModel } from "../../presistence/mongoose/models/song.model";
import { AlbumModel } from "../../presistence/mongoose/models/album.model";
import { ArtistModel } from "../../presistence/mongoose/models/artist.model"; // Assuming this exists
import { UserModel } from "../../presistence/mongoose/models/user.model";     // Assuming this exists
import { Song } from "../../../domain/entities/song.entity";
import { Album } from "../../../domain/entities/album.entity";
import { Artist } from "../../../domain/entities/arist.entity";
import { User } from "../../../domain/entities/user.entity";

export class SearchResponseService implements ISearchService {
    
    async unifiedSearch(query: string): Promise<SearchResult> {
        
        const [songs, albums, artists, users] = await Promise.all([
            this.searchSongs(query, 10), 
            this.searchAlbums(query, 5),
            this.searchArtists(query, 5),
            this.searchUsers(query, 5)
        ]);

        return {
            topResult: songs[0],
            songs: songs,
            albums: albums,
            artists: artists,
            users: users
        };
    }

   
    private async searchByTextIndex(Model: any, query: string, type: string, limit: number): Promise<any[]>{
        
        const results = await Model.find(
            { $text: { $search: query } },
            { score: { $meta: "textScore" } } 
        )
        .sort({ score: { $meta: "textScore" } }) 
        .limit(limit) 
        .lean()
        .exec();
        
        return results
    }

    // search helpers pass the limit to the main query method
    private async searchSongs(query: string, limit: number): Promise<Song[]>{
        return this.searchByTextIndex(SongModel, query, "song", limit) 
    }

    private async searchAlbums(query: string, limit: number): Promise<Album[]>{
        return this.searchByTextIndex(AlbumModel, query, "album", limit) 
    }

    private async searchArtists(query: string, limit: number): Promise<Artist[]> {
        return this.searchByTextIndex(ArtistModel, query, 'artist', limit) 
    }

    private async searchUsers(query: string, limit: number): Promise<User[]> {
        return this.searchByTextIndex(UserModel, query, 'user', limit) 
    }
}
