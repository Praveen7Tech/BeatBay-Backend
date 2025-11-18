import mongoose, { HydratedDocument, Model, Schema } from "mongoose";
import { Song } from "../../../../domain/entities/song.entity";

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
    lyricsUrl: {
        type:String,
        required: true
    },
    coverImageUrl: { 
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
    releaseDate: Date,
}, { timestamps: true });

export const SongModel: Model<SongDocument> = mongoose.model<SongDocument>('Song', songSchema);