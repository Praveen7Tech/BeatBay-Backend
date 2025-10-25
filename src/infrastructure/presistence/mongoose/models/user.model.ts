import mongoose, { Schema, Model, HydratedDocument } from 'mongoose';
import { User } from '../../../../domain/entities/user.entity';

export type UserDocument = HydratedDocument<User>;

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    profilePicture: { type: String },
    role: { type: String, enum: ['user', 'admin', 'artist'], default: 'user' },
    status: { type: Boolean, default: true }, 
  },
  { timestamps: true }
);

export const UserModel: Model<UserDocument> = mongoose.model<UserDocument>('User', userSchema);
