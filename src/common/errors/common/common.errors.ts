import { StatusCode } from "../../constants/status.enum";
import { DomainError } from "../base/domain.error";

export class AlreadyExistError extends DomainError {
    constructor(message: string){
        super(message, StatusCode.CONFLICT)
    }
}

export class OtpExpiredError extends DomainError {
    constructor(){
        super("OTP has expired.!", StatusCode.NOT_FOUND)
    }
}

export class InvalidOtpError extends DomainError {
    constructor() {
        super("Invalid OTP provided.!", StatusCode.BAD_REQUEST);
    }
}

export class NotFoundError extends DomainError {
    constructor(message:string){
        super(message, StatusCode.NOT_FOUND)
    }
}

export class BadRequestError extends DomainError {
    constructor(message: string){
        super(message, StatusCode.BAD_REQUEST)
    }
}

export class ExpiredError extends DomainError {
    constructor(message: string){
        super(message, StatusCode.EXPIRED)
    }
}

export class IncorrectPasswordError extends DomainError{
    constructor(message = "incorrect"){
        super(message, StatusCode.BAD_REQUEST)
    }
}

export class ForbiddenError extends DomainError {
    constructor(){
        super("Forbidden!", StatusCode.FORBIDDEN)
    }
}

export class BlockedAccountError extends DomainError{
    constructor(){
        super("Your account account has been blocked by an administrator, plase contact the helpline!", StatusCode.FORBIDDEN)
    }
}

export class InvalidError extends DomainError {
    constructor(message: string){
        super(message, StatusCode.BAD_REQUEST)
    }
}