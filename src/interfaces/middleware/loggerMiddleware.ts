import { Request, Response, NextFunction } from "express";

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("📌 Incoming Request:");
  console.log("URL:", req.url);
//   console.log("Method:", req.method);
//   console.log("Headers:", req.headers);
//   console.log("Body:", req.body);
//console.log("Cookies:", req.cookies);
  next();
};
