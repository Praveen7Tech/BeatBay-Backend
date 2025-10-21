import { IUserRepository } from '../../../../domain/repositories/user.repository'; 
import { User } from '../../../../domain/entities/user.entity'; 
import { UserModel } from '../models/user.model';
import { PasswordService } from '../../../services/password/password-service'; 
import { RedisCacheServive } from '../../../cache/redis/redis-cache.service';

export class MongooseUserRepository implements IUserRepository {
  constructor(
    private readonly passwordService: PasswordService
  ) {}

  async create(entity: User): Promise<User> {

    const passwordHash = await this.passwordService.hash(entity.password);
    const user = new UserModel({
      name: entity.name,
      email: entity.email,
      password: passwordHash,
      role:"user"
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
  
  async findAll(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  async update(email: string, entity: Partial<User>): Promise<User | null> {
    console.log("updation ",email, entity)
    const user = await UserModel.findOneAndUpdate(
      {email},
      entity,
      {new: true}
    ).lean()

    return user
  }
  async delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
