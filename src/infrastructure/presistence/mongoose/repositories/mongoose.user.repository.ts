import { IUserRepository } from '../../../../domain/repositories/user.repository'; 
import { User } from '../../../../domain/entities/user.entity'; 
import { UserModel } from '../models/user.model';
import { PasswordService } from '../../../services/password/password-service'; 
export class MongooseUserRepository implements IUserRepository {
  constructor(private readonly passwordService: PasswordService) {}

  async create(entity: User): Promise<User> {
    const passwordHash = await this.passwordService.hash(entity.passwordHash);
    const user = new UserModel({ ...entity, passwordHash });
    console.log("user created -",user)
    const createdUser = await user.save();
    return createdUser.toObject();
  }
  // All methods from IBaseRepository must be implemented here.
  async findById(id: string): Promise<User | null> {
    return UserModel.findById(id).lean();
  }

  async findByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email }).lean();
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
