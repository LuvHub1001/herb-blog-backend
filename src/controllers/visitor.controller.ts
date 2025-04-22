import { Request, Response } from "express";
import { VisitorService } from "../service/visitor.service";

const visitorService = new VisitorService();

export const getVisitorStats = async (req: Request, res: Response) => {
  try {
    const result = await visitorService.getVisitorStats();
    res.status(200).json(result);
  } catch (error) {
    console.error("방문자 통계 오류:", error);
    res.status(500).json({ message: "방문자 통계 조회 실패" });
  }
};

export const createVisitor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ip = req.body.ip;
    const newVisitor = await visitorService.createVisitor(ip);
    res.status(201).json(newVisitor);
  } catch (error) {
    console.error("방문자 생성 오류:", error);
    res.status(500).json({ message: "방문자 생성 실패" });
  }
};
