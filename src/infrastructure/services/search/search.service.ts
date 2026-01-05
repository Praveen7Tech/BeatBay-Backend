import { SongModel } from "../../presistence/mongoose/models/song.model";
import { AlbumModel } from "../../presistence/mongoose/models/album.model";
import { ArtistModel } from "../../presistence/mongoose/models/artist.model";    
import { ISearchService } from "../../../domain/services/search.service";
import { SearchResult } from "../../../domain/entities/search.entity";
import { Song } from "../../../domain/entities/song.entity"; 
import { Album } from "../../../domain/entities/album.entity";
import { Artist } from "../../../domain/entities/arist.entity"; 

export class SearchResponseService implements ISearchService {
    
    async unifiedSearch(query: string): Promise<SearchResult> {
        const [songs, albums, artists] = await Promise.all([
            this.searchSongs(query, 5), 
            this.searchAlbums(query, 10),
            this.searchArtists(query, 10),
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
        };
    }

    /**
     * Internal helper to execute Atlas Search with support for 
     * partial matching (mid-word) and fuzzy typing.
     */
    private async searchByAtlasSearch(Model: any, query: string, paths: string[], limit: number): Promise<any[]> {
        const indexName = Model.collection.name;

        // map autocomplete queries - fuzzy/starts-with matching
        const autocompleteQueries = paths.map(path => ({
            autocomplete: {
                query: query,
                path: path,
                tokenOrder: "any",
                fuzzy: { maxEdits: 1, prefixLength: 2 }
            }
        }));

        // Map wildcard queries - for mid-word/regex
        const wildcardQueries = paths.map(path => ({
            wildcard: {
                query: `*${query}*`, 
                path: path,
                allowAnalyzedField: true
            }
        }));

        const pipeline = [
            {
                $search: {
                    index: indexName,
                    compound: {
                        should: [...autocompleteQueries, ...wildcardQueries],
                        minimumShouldMatch: 1
                    }
                }
            },
            { $limit: limit },
            { $addFields: { score: { $meta: "searchScore" } } }
        ];
        
        return await Model.aggregate(pipeline).exec();
    }

    private async searchSongs(query: string, limit: number): Promise<Song[]> {
        return this.searchByAtlasSearch(SongModel, query, ['title', 'artistName', 'tags', 'genre', 'description'], limit); 
    }

    private async searchAlbums(query: string, limit: number): Promise<Album[]> {
        return this.searchByAtlasSearch(AlbumModel, query, ['title', 'artistName', 'songTitles', 'description'], limit);
    }

    private async searchArtists(query: string, limit: number): Promise<Artist[]> {
        return this.searchByAtlasSearch(ArtistModel, query, ['name', 'bio'], limit);
    }
}
