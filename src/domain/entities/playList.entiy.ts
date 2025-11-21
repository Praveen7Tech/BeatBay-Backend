import { ObjectId } from "mongoose"

export interface PlayList{
    _id: ObjectId
    name: string
    songs: string[]
    createdAt: Date
    updatedAt: Date
}