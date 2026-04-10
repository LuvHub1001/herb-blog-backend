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
    // 클라이언트 body를 신뢰하지 않고 서버에서 직접 IP 추출
    // app.set("trust proxy", 1)에 의해 req.ip는 X-Forwarded-For의 첫 IP가 됨
    const ip = req.ip || "unknown";
    const newVisitor = await visitorService.createVisitor(ip);
    res.status(201).json({ success: true, data: newVisitor });
  } catch (error) {
    next(error);
  }
};
