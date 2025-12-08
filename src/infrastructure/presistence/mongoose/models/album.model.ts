import mongoose, { HydratedDocument, Model, Schema } from "mongoose";
import { Album } from "../../../../domain/entities/album.entity";

type AlbumDocument = HydratedDocument<Album>

const AlbumSchema = new Schema({
    artistId:{
        type: Schema.Types.ObjectId, ref: "Artist",
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    coverImageUrl:{
        type:String,
        required: true
    },
    coverImagePublicId:{
        type: String,
        required: true
    },
    songs:[{
        type:Schema.Types.ObjectId,
        ref : "Song"
    }],

}, {timestamps:true})

export const AlbumModel: Model<AlbumDocument> = mongoose.model<AlbumDocument>("Album", AlbumSchema)