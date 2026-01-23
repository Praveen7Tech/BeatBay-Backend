export interface SongUploadFile{
    trackFile: Express.Multer.File[]
    coverImage: Express.Multer.File[]
    lrcFile: Express.Multer.File[]
}