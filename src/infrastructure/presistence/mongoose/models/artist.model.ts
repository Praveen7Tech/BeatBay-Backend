import mongoose, { HydratedDocument, Model, Schema } from "mongoose";
import { Artist } from "../../../../domain/entities/arist.entity";
import { string } from "zod";

export type ArtistDocument = HydratedDocument<Artist>

const artistSchema = new Schema<ArtistDocument>(
    {
        userId:{
            type: String,
            ref: "User",
            required: true,
            unique: true
        },
        bio:{
            type: String
        },
        albums:[{
            type: Schema.Types.ObjectId,
            ref: 'Album'
        }],
        songs: [{
            type: Schema.Types.ObjectId,
            ref: 'Song'
        }]
    },
    {timestamps: true}
);

export const ArtistModel: Model<ArtistDocument> = mongoose.model<ArtistDocument>('Artist', artistSchema)