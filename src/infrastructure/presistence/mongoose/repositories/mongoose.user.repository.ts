import { IUserRepository } from '../../../../domain/repositories/user.repository';
import { User } from '../../../../domain/entities/user.entity';
import { UserModel } from '../../../mongoose/models/user.model';
import { hash, genSalt } from 'bcrypt';

export class MongooseUserRepository implements IUserRepository {
  async create(entity: User): Promise<User> {
    const salt = await genSalt(10);
    const password = await hash(entity.passwordHash, salt);
    const user = new UserModel({ ...entity, password });
    const createdUser = await user.save();
    return createdUser.toObject();
  }

  // Other methods (findById, findByEmail etc.)
  async findByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email }).lean();
  }

  // Other methods would be implemented here to fulfill the IBaseRepository contract
  async findById(id: string): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
  async findAll(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
  async update(id: string, entity: Partial<User>): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
  async delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
