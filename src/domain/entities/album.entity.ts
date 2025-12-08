
export interface Album{
    _id: string
    artistId:string
    title: string
    description: string
    coverImageUrl: string
    coverImagePublicId: string
    songs: string[]
    createdAt: Date;
    updatedAt: Date;
}