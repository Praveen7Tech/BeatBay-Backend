import { IUserRepository } from '../../../../domain/repositories/user.repository';
import { User } from '../../../../domain/entities/user.entity';
import { UserModel } from '../models/user.model';
import { PasswordService } from '../../../services/password/password-service';

export class MongooseUserRepository implements IUserRepository {
  constructor() {}

  async create(entity: User): Promise<User> {
    
    const user = new UserModel({
      name: entity.name,
      email: entity.email,
      password: entity.password,
      profilePicture: entity.profilePicture,
      role: entity.role ?? 'user',
      status: entity.status ?? true,
    });

    const createdUser = await user.save();
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
