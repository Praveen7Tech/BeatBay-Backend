import { ObjectId } from "mongoose"
import { Song } from "./song.entity"

export interface PlayList{
    _id: ObjectId
    userId: string
    name: string
    description: string | null
    coverImageUrl: string
    coverImagePublicId: string
    songs: Song[]
    createdAt: Date
    updatedAt: Date
}