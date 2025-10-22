import { Request, Response, NextFunction } from 'express';
import { DomainError } from '../../common/errors/user.auth.error'; 
import { StatusCode } from '../../common/status.enum'; 
import { ZodError } from 'zod';

export const errorHandlerMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Catch error: ", err);

    if (err instanceof ZodError) {
        return res.status(StatusCode.BAD_REQUEST).json({
            message: "Validation failed",
            errors: err.issues.map((issue) => ({
                path: issue.path.join("."),
                message: issue.message,
            }))
        });
    }

    if (err instanceof DomainError) {
        return res.status(err.status).json({ message: err.message });
    }

    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: err.message || 'Internal server error' });
};
