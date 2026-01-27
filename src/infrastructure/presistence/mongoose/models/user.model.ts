import mongoose, { Schema, Model, HydratedDocument } from 'mongoose';
import { User } from '../../../../domain/entities/user.entity';

export type UserDocument = HydratedDocument<User>;

const userSchema = new Schema<UserDocument>(
  {
    name: { 
      type: String 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    password: { 
      type: String 
    },
    profilePicture: {   
      type: String 
    },
    profileImagePublicId:{
      type: String,
      default: null
    },
    role: { 
      type: String, 
      enum: ['user', 'admin', 'artist'], 
      default: 'user' 
    },
    status: { 
      type: Boolean, 
      default: true 
    }, 
    playLists:[{
      type: Schema.Types.ObjectId,
      ref: "PlayList",
      default: []
    }],
    followingArtists: [{
      type: Schema.Types.ObjectId,
      ref: "Artist"
    }],
    followingUsers:[{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    followingCount: {
      type: Number,
      default: 0
    },
    followersCount:{
      type: Number,
      default: 0
    },
    isPremium: {
      type: Boolean,
      default: false
    },
    stripeCustomerId:{
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

userSchema.index({ name: 1 })

export const UserModel: Model<UserDocument> = mongoose.model<UserDocument>('User', userSchema);
