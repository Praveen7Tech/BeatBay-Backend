import { StatusCode } from "../../constants/status.enum";

export abstract class DomainError extends Error {
    constructor(
        public readonly message: string,
        public readonly status: StatusCode
    ){
        super(message);
        Object.setPrototypeOf(this, new.target.prototype)
    }
}