
import mongoose, { Schema, Document } from 'mongoose';

const followerSchema = new Schema({
    followerId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true },
    targetId: { 
        type: Schema.Types.ObjectId, 
        required: true 
    }, 
    targetType: { 
        type: String, enum: ['User', 'Artist'], 
        required: true 
    }
}, { timestamps: true });

followerSchema.index({ followerId: 1, targetId: 1 }, { unique: true });
followerSchema.index({ targetId: 1 });

export const FollowerModel = mongoose.model('Follower', followerSchema);
