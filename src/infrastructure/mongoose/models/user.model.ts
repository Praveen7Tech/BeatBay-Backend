import mongoose, { Schema, Model, HydratedDocument } from 'mongoose';
import { User } from '../../../domain/entities/user.entity';

// Define the hydrated document type using HydratedDocument
export type UserDocument = HydratedDocument<User>;

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: { 
      type: String,
    },
  },
  { timestamps: true }
);

export const UserModel: Model<UserDocument> = mongoose.model<UserDocument>('User', userSchema);
