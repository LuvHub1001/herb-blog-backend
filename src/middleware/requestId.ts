import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export const requestId = (req: Request, res: Response, next: NextFunction): void => {
  const id = (req.headers["x-request-id"] as string) || crypto.randomUUID();
  res.setHeader("X-Request-Id", id);
  (req as any).requestId = id;
  next();
};
