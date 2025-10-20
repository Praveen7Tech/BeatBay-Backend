import { Request, Response, NextFunction } from 'express';
import { DomainError, UserAlreadyExistsError, OtpExpiredError, InvalidOtpError, UserNotFoundError, BadRequestError } from "../../common/errors/user.auth.error"
import { StatusCode } from '../../common/status.enum';
import { ZodError } from 'zod';

export const errorHandlerMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log("catch error ",err);

  if (err instanceof ZodError) {
    return res.status(400).json({ 
      message: "Validation failed", 
       errors: err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }))
    });
  }


  if (err instanceof UserAlreadyExistsError) {
    return res.status(StatusCode.CONFLICT).json({ message: err.message });
  }

  if (err instanceof OtpExpiredError) {
    return res.status(StatusCode.NOT_FOUND).json({ message: err.message });
  }

  if (err instanceof InvalidOtpError) {
    return res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
  }

  if(err instanceof UserNotFoundError){
    return res.status(StatusCode.NOT_FOUND).json({message: err.message})
  }

  if (err instanceof BadRequestError){
    return res.status(StatusCode.BAD_REQUEST).json({message: err.message})
  }

  // fallback for unknown errors
  return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: err.message || 'Internal server error' });
};
