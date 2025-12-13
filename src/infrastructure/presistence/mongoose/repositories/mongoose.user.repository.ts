import { IUserRepository } from '../../../../domain/repositories/user.repository';
import { User } from '../../../../domain/entities/user.entity';
import { UserModel } from '../models/user.model';
import { userModule } from '../../../di/modules/user.module';
import { Artist } from '../../../../domain/entities/arist.entity';
import { ClientSession, model } from 'mongoose';
import path from 'path';
import { PaginatedResult } from '../../../../domain/interfaces/paginatedResult.interface';
import { title } from 'process';

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

  async isFollowing(userId: string, artistId: string): Promise<boolean> {
      const user = await UserModel.findById(userId).select("followingArtists")

      return user?.followingArtists?.includes(artistId) || false
  }

  async addFollow(userId: string, artistId: string): Promise<void> {
      await UserModel.findByIdAndUpdate(userId,{
        $addToSet:{followingArtists: artistId},
        $inc:{followingCount: 1}
      }).exec()
  }

  async removeFollow(userId: string, artistId: string): Promise<void> {
      await UserModel.findByIdAndUpdate(userId,{
        $pull:{followingArtists: artistId},
        $inc:{followingCount:-1}
      }).exec()
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


  async find(query: string): Promise<User[] | null> {
      const users = await UserModel.find({name: query}).exec()

      return users
  }

}
