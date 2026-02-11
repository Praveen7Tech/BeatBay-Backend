import { ObjectId } from "mongoose"
import { SongNew } from "./song.entity"

export interface PlayList{
    _id: ObjectId
    userId: string
    name: string
    description: string | null
    coverImageUrl: string
    coverImagePublicId: string
    songs: SongNew[]
    createdAt: Date
    updatedAt: Date
}