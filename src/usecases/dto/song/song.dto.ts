
export interface UploadSongDTO {
    title: string, 
    genre: string, 
    description: string, 
    tags: string, 
    songFilePath:string,
    coverImagePath:string,
    lrcFilePath:string
    duration: number
}