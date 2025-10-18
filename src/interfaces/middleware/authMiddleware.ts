import { Request, Response, NextFunction, RequestHandler } from "express";
import { StatusCode } from "../../common/status.enum";
import { MESSAGES } from "../../common/constants.message";
import jwt from "jsonwebtoken";

// Explicitly type it as RequestHandler (so Express knows it's valid middleware)
export const authMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  
  const authHeader = req.headers["authorization"]; 
  console.log("middle ware reach",authHeader)

  if (!authHeader) {
    return res
      .status(StatusCode.UNAUTHORIZED)
      .json({ message: MESSAGES.UNAUTHORIZED });
  }

  const token = (authHeader as string).split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET as string);
    console.log("verify complete ✅");
    // Optionally attach user info to req for later use
    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error("error in authorization middleware ❌", error);
    return res
      .status(StatusCode.UNAUTHORIZED)
      .json({ message: "Invalid or expired token" });
  }
};
