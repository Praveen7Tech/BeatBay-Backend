import mongoose, { HydratedDocument, Model, Schema } from "mongoose";
import { Song } from "../../../../domain/entities/song.entity";

export type SongDocument = HydratedDocument<Song>;

const songSchema = new Schema({
    artistId: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
    artistName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },  
    genre: { type: String, required: true },
    audioUrl: { type: String, required: true },
    audioPublicId: { type: String, required: true },
    lyricsUrl: { type: String, required: true },
    lyricsPublicId: { type: String, required: true },
    coverImageUrl: { type: String, required: true },
    coverImagePublicId: { type: String, required: true },
    status: { type: Boolean, default: true},
    tags: { type: [String] },
    duration: { type: Number, required: true },
    playCount: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
}, { timestamps: true }); 


export const SongModel: Model<SongDocument> = mongoose.model<SongDocument>('Song', songSchema);
