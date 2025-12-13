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
            type:String,
            default: null
        },
        profileImagePublicId:{
            type: String,
            default: null
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
        },
        followersCount:{
            type: Number,
            default: 0
        }
    },
    {timestamps: true}
);

artistSchema.index(
    { name: "text" },
    { weights: { name: 10 } } 
);

export const ArtistModel: Model<ArtistDocument> = mongoose.model<ArtistDocument>('Artist', artistSchema)