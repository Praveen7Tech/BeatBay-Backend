import { SongModel } from "../../presistence/mongoose/models/song.model";
import { AlbumModel } from "../../presistence/mongoose/models/album.model";
import { ArtistModel } from "../../presistence/mongoose/models/artist.model"; 
import { UserModel } from "../../presistence/mongoose/models/user.model";     
import { ISearchService } from "../../../domain/services/search.service";
import { SearchResult } from "../../../domain/entities/search.entity";
import { Song } from "../../../domain/entities/song.entity"; 
import { Album } from "../../../domain/entities/album.entity";
import { Artist } from "../../../domain/entities/arist.entity"; 
import { User } from "../../../domain/entities/user.entity"; 

export class SearchResponseService implements ISearchService {
    
    async unifiedSearch(query: string): Promise<SearchResult> {
        
        const [songs, albums, artists] = await Promise.all([
            this.searchSongs(query, 5), 
            this.searchAlbums(query, 10),
            this.searchArtists(query, 10),
            //this.searchUsers(query, 10) 
        ]);

        let topResult: Song | null = null;
        if (songs.length > 0) {
            topResult = songs[0];
        }

        return {
            topResult: topResult,
            songs: songs,
            albums: albums,
            artists: artists,
           // users: users
        };
    }

    private async searchByAtlasSearch(Model: any, query: string, paths: string[], limit: number): Promise<any[]>{
        // setup the index exaclty arranged in the atless SearchIndex collection name
        const indexName = Model.collection.name; 

        const pipeline = [
            {
                $search: {
                    index: indexName, 
                    compound: {
                        should: paths.map(path => ({
                            autocomplete: { 
                                query: query,
                                path: path, 
                                tokenOrder: "any", // flexible order of querying
                                fuzzy: { // Adds typo tolerance
                                    maxEdits: 1,
                                    prefixLength: 2
                                }
                            }
                        })),
                    }
                }
            },
            { $limit: limit }, 
        ];
        
        const results = await Model.aggregate(pipeline, { lean: true }).exec();
        return results;
    }

    // search helpers updated to pass an ARRAY of ALL paths:

    private async searchSongs(query: string, limit: number): Promise<Song[]>{
        return this.searchByAtlasSearch(SongModel, query, ['title','artistName', 'tags', 'genre', 'description'], limit); 
    }

    private async searchAlbums(query: string, limit: number): Promise<Album[]>{
        return this.searchByAtlasSearch(AlbumModel, query, ['title', 'artistName','songTitles', 'description'], limit);
    }

    private async searchArtists(query: string, limit: number): Promise<Artist[]> {
        return this.searchByAtlasSearch(ArtistModel, query, ['name', 'bio'], limit);
    }

    // private async searchUsers(query: string, limit: number): Promise<User[]> {
    //     return this.searchByAtlasSearch(UserModel, query, ['name'], limit);
    // }
}
