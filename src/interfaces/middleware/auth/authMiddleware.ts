import { Request, Response, NextFunction, RequestHandler } from "express";
import { StatusCode } from "../../../common/constants/status.enum";
import { MESSAGES } from "../../../common/constants/constants.message";
import jwt, { JwtPayload } from "jsonwebtoken";
import logger from "../../../infrastructure/utils/logger/logger";

export interface AuthRequest extends Request{
  user?: {id: string, email: string, role: string}
}


export const authMiddleware: RequestHandler = (req: AuthRequest, res: Response, next: NextFunction) => {
  
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(StatusCode.UNAUTHORIZED).json({ message: MESSAGES.UNAUTHORIZED });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET as string) as JwtPayload
    //logger.info("token verify complete ✅");

    req.user = {id : decoded.id, email: decoded.email, role: decoded.role}
    next();
  } catch (error) {
    console.error("error in authorization middleware ❌", error);
    return res.status(StatusCode.UNAUTHORIZED).json({ message: "Invalid or expired token" });
  }
};
