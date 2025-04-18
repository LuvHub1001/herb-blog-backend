import { Request, Response } from "express";
import { VisitorService } from "../service/visitor.service";

const visitorService = new VisitorService();

export const getAllVisitors = async (req: Request, res: Response) => {
  const page = parseInt(req.params.page) || 1;
  const limit = parseInt(req.params.limit) || 8;

  const result = await visitorService.getAllVisitors(page, limit);

  res.status(200).json(result);
};

export const getVisitorStats = async (req: Request, res: Response) => {
  const result = await visitorService.getVisitorStats();
  res.status(200).json(result);
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
