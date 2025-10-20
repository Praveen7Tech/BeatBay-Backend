export class DomainError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class UserAlreadyExistsError extends DomainError {
  constructor() {
    super('User already exists');
  }
}

export class OtpExpiredError extends DomainError {
  constructor() {
    super('OTP expired');
  }
}

export class InvalidOtpError extends DomainError {
  constructor() {
    super('Invalid OTP');
  }
}

export class UserNotFoundError extends DomainError {
  constructor(){
    super("User not found")
  }
}

export class BadRequestError extends DomainError{
  constructor(){
    super("invalid credentials")
  }
}
