import { IUserRepository } from '../../../../domain/repositories/user.repository';
import { User } from '../../../../domain/entities/user.entity';
import { UserModel } from '../models/user.model';
import { userModule } from '../../../di/modules/user.module';
import { Artist } from '../../../../domain/entities/arist.entity';

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

}
