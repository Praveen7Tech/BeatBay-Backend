import { IUserRepository } from '../../../../domain/repositories/user.repository';
import { User } from '../../../../domain/entities/user.entity';
import { UserModel } from '../models/user.model';
import { ClientSession } from 'mongoose';

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


}
