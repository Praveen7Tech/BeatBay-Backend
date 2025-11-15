
export interface Album{
    _id: string
    artistId:string
    title: string
    description: string
    coverImageURL: string
    songs: string[]
    createdAt: Date;
    updatedAt: Date;
}