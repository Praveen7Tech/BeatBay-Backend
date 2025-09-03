import { IUserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { MESSAGES } from '../../common/constants.message';
import { StatusCode } from '../../common/status.enum';

interface SignupRequest {
  email: string;
  passwordHash: string;
}

export class SignupUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request: SignupRequest): Promise<{ user?: User; status: StatusCode; message: string }> {
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      return { status: StatusCode.CONFLICT, message: MESSAGES.USER_ALREADY_EXISTS };
    }

    const newUser = await this.userRepository.create({
      email: request.email,
      passwordHash: request.passwordHash,
    });

    return {
      user: newUser,
      status: StatusCode.CREATED,
      message: MESSAGES.USER_CREATED_SUCCESSFULLY,
    };
  }
}
