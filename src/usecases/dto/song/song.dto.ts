
export interface UploadSongDTO {
    title: string, 
    genre: string, 
    description: string, 
    tags: string, 
    album:string, 
    lyrics?:string, 
    releaseDate:string, 
    songFilePath:string,
    coverImagePath:string,
    lrcFilePath:string
}