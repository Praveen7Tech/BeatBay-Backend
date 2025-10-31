import { Request, Response, NextFunction, RequestHandler } from "express";
import { StatusCode } from "../../common/status.enum";
import { MESSAGES } from "../../common/constants.message";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request{
  user?: {id: string, email: string}
}


export const authMiddleware: RequestHandler = (req: AuthRequest, res: Response, next: NextFunction) => {
  
  const authHeader = req.headers["authorization"];
  console.log("tok ", authHeader) 

  if (!authHeader) {
    return res.status(StatusCode.UNAUTHORIZED).json({ message: MESSAGES.UNAUTHORIZED });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET as string) as JwtPayload
    console.log("verify complete ✅", decoded);

    req.user = {id : decoded.id, email: decoded.email}
    next();
  } catch (error) {
    console.error("error in authorization middleware ❌", error);
    return res.status(StatusCode.UNAUTHORIZED).json({ message: "Invalid or expired token" });
  }
};
