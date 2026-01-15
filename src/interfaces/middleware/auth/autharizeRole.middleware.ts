import { NextFunction, Response } from "express";
import { AuthRequest } from "./authMiddleware";
import { StatusCode } from "../../../common/constants/status.enum";
import logger from "../../../infrastructure/utils/logger/logger";

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(StatusCode.FORBIDDEN).json({ message: "Access Denied: No Role Provided" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(StatusCode.FORBIDDEN).json({ 
        message: `Access Denied: ${req.user.role} role does not have permission.` 
      });
    }
    //logger.info("Role based autharization complete!")
    next();
  };
};
