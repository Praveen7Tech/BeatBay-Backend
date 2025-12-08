import mongoose, { HydratedDocument, Model, Schema } from "mongoose";
import { Song } from "../../../../domain/entities/song.entity";
import { required } from "zod/v4/core/util.cjs";

export type SongDocument = HydratedDocument<Song>;

const songSchema = new Schema({
    artistId: { 
        type: Schema.Types.ObjectId, ref: 'Artist', required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    genre: { 
        type: [String], 
        required: true 
    },
    audioUrl: { 
        type: String, 
        required: true 
    },
    audioPublicId:{
        type: String,
        required: true
    },
    lyricsUrl: {
        type:String,
        required: true
    },
    lyricsPublicId:{
        type: String,
        required: true
    },
    coverImageUrl: { 
        type: String, 
        required: true 
    },
    coverImagePublicId: { 
        type: String, 
        required: true 
    },
    description: {
        type: String
    },
    duration:{
        type: String
    },
    tags: {
        type: [String]
    },
    releaseDate: {
        type: Date,
        default: Date.now()
    },
}, { timestamps: true });

export const SongModel: Model<SongDocument> = mongoose.model<SongDocument>('Song', songSchema);