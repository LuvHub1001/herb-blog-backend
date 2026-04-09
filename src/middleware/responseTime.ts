import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

export const responseTime = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const level = duration > 500 ? "warn" : "debug";
    logger[level](`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });

  next();
};
