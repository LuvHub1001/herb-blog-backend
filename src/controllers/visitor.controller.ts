import { Request, Response, NextFunction } from "express";
import { VisitorService } from "../service/visitor.service";

const visitorService = new VisitorService();

export const getVisitorStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await visitorService.getVisitorStats();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const createVisitor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ip = req.body.ip;
    const newVisitor = await visitorService.createVisitor(ip);
    res.status(201).json({ success: true, data: newVisitor });
  } catch (error) {
    next(error);
  }
};
