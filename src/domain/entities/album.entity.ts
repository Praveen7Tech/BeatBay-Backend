
export interface Album{
    _id: string
    artistId:string
    artistName: string
    title: string
    description: string
    coverImageUrl: string
    coverImagePublicId: string
    songs: string[]
    songTitles: string[]
    isActive: boolean
    createdAt: Date;
    updatedAt: Date;
}