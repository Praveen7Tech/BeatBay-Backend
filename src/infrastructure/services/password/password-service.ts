import { hash, compare, genSalt } from 'bcrypt';
import { IPasswordService } from '../../../domain/services/password.service'; 

export class PasswordService implements IPasswordService {
  async hash(password: string): Promise<string> {
    const salt = await genSalt(10);
    return hash(password, salt);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }
}
