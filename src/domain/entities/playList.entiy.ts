import { ObjectId } from "mongoose"
import { Song } from "./song.entity"

export interface PlayList{
    _id: ObjectId
    userId: string
    name: string
    songs: Song[]
    createdAt: Date
    updatedAt: Date
}