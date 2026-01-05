import { IUserRepository } from '../../../../domain/repositories/user.repository';
import { User } from '../../../../domain/entities/user.entity';
import { UserModel } from '../models/user.model';
import { userModule } from '../../../di/modules/user.module';
import { Artist } from '../../../../domain/entities/arist.entity';
import mongoose, { ClientSession, model } from 'mongoose';
import path from 'path';
import { PaginatedResult } from '../../../../domain/interfaces/paginatedResult.interface';
import { title } from 'process';
import { UserProfileRespnseDTO } from '../../../../application/dto/profile/profile.dto';
import { ArtistModel } from '../models/artist.model';

export class MongooseUserRepository implements IUserRepository {
  constructor() {}

  async create(entity: User): Promise<User> {
    
    const user = new UserModel(entity);

    const createdUser = await user.save();
    return createdUser.toObject();
  }

  async findById(id: string): Promise<User | null> {
    return UserModel.findById(id).lean();
  }

  async findByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email }).lean();
  }

  async update(_id: string, entity: Partial<User>): Promise<User | null> {
    return UserModel.findOneAndUpdate({ _id }, entity, { new: true }).lean();
  }

  async isFollowing(followId: string, targetId: string, role: string): Promise<boolean> {
      const followField = role === "artist" ? "followingArtists" : "followingUsers"

      const exists = await UserModel.exists({
        _id: followId,
        [followField]: targetId
      })

      return !!exists
  }

  async toggleFollow(followId: string, targetId: string, role: string, action: string): Promise<void> {
      const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const isFollow = action === 'follow';
        
        // update based on the target role
        const followField = role === 'artist' ? 'followingArtists' : 'followingUsers';
        
        const followerUpdate = isFollow 
            ? { $addToSet: { [followField]: targetId }, $inc: { followingCount: 1 } }
            : { $pull: { [followField]: targetId }, $inc: { followingCount: -1 } };

        const targetUpdate = isFollow
            ? { $inc: { followersCount: 1 } }
            : { $inc: { followersCount: -1 } };

        // update the user
        await UserModel.findByIdAndUpdate(followId, followerUpdate, { session });

        //  Update the target user or artist
        if (role === 'artist') {
            await ArtistModel.findByIdAndUpdate(targetId, targetUpdate, { session });
        } else {
            await UserModel.findByIdAndUpdate(targetId, targetUpdate, { session });
        }

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
  }

  async following(userId: string): Promise<Artist[] | []> {
      const following = await UserModel.findById(userId)
      .select("followingArtists")
      .populate({
        path: "followingArtists",
        select: "name role profilePicture"
      })
      .exec()

      return following?.followingArtists as unknown as Artist[] || []
  }

  async addPlayList(userId: string, playListId: string, session?: ClientSession): Promise<void> {
      await UserModel.findByIdAndUpdate(
        userId,
        {$push:{playLists: playListId}},
        {new: true, session}
      )
  }

  async findPlayListByUser(id: string): Promise<User | null> {
          const userDoc = await UserModel.findById(id)
              .populate({
                  path: 'playLists', 
                  model: 'PlayList', 
                  populate: {
                      path: 'songs',     
                      model: 'Song',   
                  },
              })  
              .lean() 
              .exec(); 
          
          return userDoc 
  }

  async findAll(page: number, limit: number, search: string): Promise<PaginatedResult<User>> {
      
    const skip = (page-1) * limit
    const filterOption = search ? 
    {
      role: "user",
      $or:[
        {name: {$regex: search, $options:"i"}},
        {email: {$regex: search, $options:"i"}}
      ]
    }
    :
    {role:"user"}

    const [data, totalCount] = await Promise.all([
      UserModel.find(filterOption).sort({createdAt: -1}).skip(skip).limit(limit).lean().exec(),
      UserModel.countDocuments(filterOption)
    ])

    return {data, totalCount }
  }

  async blockById(id: string): Promise<boolean> {
      const user = await UserModel.findByIdAndUpdate(id,
        {status: false}
      ).lean()

      return user !== null
  }

  async unBlockById(id: string): Promise<boolean> {
      const user = await UserModel.findByIdAndUpdate(id,
        {status: true}
      ).lean()

      return user !== null
  }

  async countDocuments(): Promise<number> {
      return await UserModel.countDocuments({role: "user"})
  }


  async searchByName(query: string): Promise<User[] | null> {
      const users = await UserModel.find(
        {name: {$regex: new RegExp(query, 'i')}}
      ) 
      .limit(10)
      .lean().exec()

      return users
  }

  async getUserProfileDetails(userId: string): Promise<User | null> {
      const user = await UserModel.findById(userId)
          .populate({
            path: "followingArtists",
            select: "name profilePicture"
          })
          .populate({
            path: "playLists",
            select: "name coverImageUrl"
          })
          .lean(); 

      return user
  }

  async getMutualFriends(userId: string): Promise<User[]> {
      const user = await UserModel.findById(userId).select("followingUsers").lean()

      if(!user || user.followingUsers.length == 0) return []

      return await UserModel.find({
        _id: {$in : user.followingUsers},
        followingUsers: userId
      })
      .select("name profilePicture status")
      .lean()
  }

}
