
import { ISearchService } from "../../../domain/services/search.service";
import { SearchResponseDTO, SongDTO } from "../../dto/search/search.response.dto";


export class UserGetSearchDataUseCase{
    constructor(
        private readonly _searchService: ISearchService
    ){}

    async execute(query: string): Promise<SearchResponseDTO>{

       const data = await this._searchService.unifiedSearch(query)
    
       const songs = data.songs
       const albums = data.albums
       const artist = data.artists
       const users = data.users

       
       const resSong = songs.map((s)=>({
            id:s._id,
            title: s.title,
            artist: s.artistName,
            coverImageUrl: s.coverImageUrl,
            duration: s.duration
        }))
        const topResult = resSong[0]
        const resAlbum = albums.map((a)=>({
            id:a._id,
            title:a.title,
            coverImageUrl: a.coverImageUrl,
            artist: a.artistName
        }))
        const resArtist = artist.map((a)=> ({
            id:a._id,
            name:a.name,
            profilePicture:a.profilePicture ?? ''
        }))
        const resUser = users.map((a)=> ({
            id:a._id,
            name:a.name ?? "",
            profilePicture:a.profilePicture ?? ''
        }))
       return {
            topResult:topResult,
            songs:resSong,
            albums:resAlbum,
            artists:resArtist,
            users: resUser
        }
    }
}