import { ISearchService } from "../../../domain/services/search.service";
import { SearchResponseDTO, SongDTO, AlbumDTO, ArtistDTO, TopResultDTO } from "../../dto/search/search.response.dto";
import { Song } from "../../../domain/entities/song.entity"; 
import { Album } from "../../../domain/entities/album.entity";
import { Artist } from "../../../domain/entities/arist.entity";  
import { User } from "../../../domain/entities/user.entity"; 
import { IUserRepository } from "../../../domain/repositories/user.repository";


export class UserGetSearchDataUseCase{
    constructor(
        private readonly _searchService: ISearchService,
        private readonly _userRepository: IUserRepository
    ){}

    async execute(query: string): Promise<SearchResponseDTO>{

       const data = await this._searchService.unifiedSearch(query);
       const users = await this._userRepository.searchByName(query)
    
       const songs = data.songs;
       const albums = data.albums;
       const artist = data.artists;
      // const users = data.users;

       
       const resSong: SongDTO[] = songs.map((s: Song) => ({
            id: s._id.toString(),
            title: s.title,
            artist: s.artistName,
            coverImageUrl: s.coverImageUrl,
            duration: s.duration
        }));

        // The top result is the first song, mapped to its specific DTO
        let topResult: TopResultDTO | null = null;
        if(data.topResult) {
            topResult = {
                id: data.topResult._id.toString(),
                title: data.topResult.title,
                artist: data.topResult.artistName,
                coverImageUrl: data.topResult.coverImageUrl,
            }
        }
        
        const resAlbum: AlbumDTO[] = albums.map((a: Album) => ({
            id: a._id.toString(),
            title: a.title,
            coverImageUrl: a.coverImageUrl,
            artist: a.artistName
        }));

        const resArtist: ArtistDTO[] = artist.map((a: Artist) => ({
            id: a._id.toString(),
            name: a.name,
            profilePicture: a.profilePicture ?? ''
        }));
        
        const resUser: ArtistDTO[] = users?.map((a: User) => ({ 
            id: a._id.toString(),
            name: a.name ?? '', 
            profilePicture: a.profilePicture ?? ''
        })) ?? [];
        
        
       return {
            // Assign the mapped top result DTO
            topResult: topResult, 
            songs: resSong,
            albums: resAlbum,
            artists: resArtist,
            users: resUser 
        }
    }
}
