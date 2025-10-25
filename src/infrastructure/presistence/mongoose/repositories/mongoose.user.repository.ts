import { IUserRepository } from '../../../../domain/repositories/user.repository';
import { User } from '../../../../domain/entities/user.entity';
import { UserModel } from '../models/user.model';
import { ClientSession } from 'mongoose';

export class MongooseUserRepository implements IUserRepository {
  constructor() {}

  async create(entity: User, session?: ClientSession): Promise<User> {
    
    const user = new UserModel(entity);

    const createdUser = await user.save({session});
    return createdUser.toObject();
  }

  async findById(id: string): Promise<User | null> {
    return UserModel.findById(id).lean();
  }

  async findByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email }).lean();
  }

  async update(email: string, entity: Partial<User>): Promise<User | null> {
    return UserModel.findOneAndUpdate({ email }, entity, { new: true }).lean();
  }

  async findAll(): Promise<User[]> {
     throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
