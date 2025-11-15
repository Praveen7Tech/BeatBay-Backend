import mongoose, { HydratedDocument, Model, Schema } from "mongoose";
import { Artist } from "../../../../domain/entities/arist.entity";

export type ArtistDocument = HydratedDocument<Artist>

const artistSchema = new Schema<ArtistDocument>(
    {
        name:{
            type: String,
            required: true,
        },
        email:{
            type:String, required: true, unique:true
        },
        password:{
            type:String
        },
        googleId:{
            type:String
        },
        profilePicture:{
            typr:String
        },
        bio:{
            type: String
        },
        role: { 
            type: String,
             enum: ['user','artist'], default: 'artist' },
        albums:[{
            type: Schema.Types.ObjectId,
            ref: 'Album'
        }],
        songs: [{
            type: Schema.Types.ObjectId,
            ref: 'Song'
        }],
        status:{
            type:Boolean, 
            default:true
        }
    },
    {timestamps: true}
);

export const ArtistModel: Model<ArtistDocument> = mongoose.model<ArtistDocument>('Artist', artistSchema)