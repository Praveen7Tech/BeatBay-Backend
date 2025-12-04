import { ObjectId } from "mongoose";

export interface playListProjection {
    _id: ObjectId
    name: string
    coverImageUrl?: string | null
}