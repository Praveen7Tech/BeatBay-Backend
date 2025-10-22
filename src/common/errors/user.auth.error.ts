import { StatusCode } from "../status.enum";

export abstract class DomainError extends Error {
    constructor(message: string, public readonly status: StatusCode) {
        super(message);
        Object.setPrototypeOf(this, DomainError.prototype);
    }
}

export class UserAlreadyExistsError extends DomainError {
    constructor() {
        super("User with this email already exists", StatusCode.CONFLICT);
        Object.setPrototypeOf(this, UserAlreadyExistsError.prototype);
    }
}

export class OtpExpiredError extends DomainError {
    constructor() {
        super("OTP has expired", StatusCode.NOT_FOUND);
        Object.setPrototypeOf(this, OtpExpiredError.prototype);
    }
}

export class InvalidOtpError extends DomainError {
    constructor() {
        super("Invalid OTP provided", StatusCode.BAD_REQUEST);
        Object.setPrototypeOf(this, InvalidOtpError.prototype);
    }
}

export class UserNotFoundError extends DomainError {
    constructor() {
        super("User not found", StatusCode.NOT_FOUND);
        Object.setPrototypeOf(this, UserNotFoundError.prototype);
    }
}

export class BadRequestError extends DomainError {
    constructor(message: string = "Invalid request") {
        super(message, StatusCode.BAD_REQUEST);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}
