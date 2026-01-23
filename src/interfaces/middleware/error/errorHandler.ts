import { Request, Response, NextFunction } from 'express';
import { DomainError } from '../../../common/errors/base/domain.error'; 
import { StatusCode } from '../../../common/constants/status.enum'; 
import { ZodError } from 'zod';

export const errorHandlerMiddleware = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Catch error: ", err);

    if (err instanceof ZodError) {
        return res.status(StatusCode.BAD_REQUEST).json({
            message: "Validation failed.!",
            errors: err.issues.map((issue) => ({
                path: issue.path.join("."),
                message: issue.message,
            }))
        });
    }

    if (err instanceof DomainError) {
        return res.status(err.status).json({ message: err.message });
    }

    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ 
        message: errorMessage 
    });
};
