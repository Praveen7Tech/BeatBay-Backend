import { Request, Response, NextFunction } from "express";
import logger from "../../../infrastructure/utils/logger/logger"; 

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`📌 Incoming Request URL: ${req.url}`);
//   console.log("Method:", req.method);
//   console.log("Headers:", req.headers);
//   console.log("Body:", req.body);
//console.log("Cookies:", req.cookies);
  next();
};