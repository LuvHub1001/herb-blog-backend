import { Request, Response } from "express";
import { BoardService } from "../service/board.service";

const boardService = new BoardService();

export const getAllBoardList = async (req: Request, res: Response) => {
  const page = parseInt(req.params.page) || 1;
  const limit = parseInt(req.params.limit) || 6;

  const boardService = new BoardService();
  const result = await boardService.getAllBoardList(page, limit);

  res.status(200).json(result);
};

export const getBoardsByCategory = async (req: Request, res: Response) => {
  const category = req.params.category;
  const page = parseInt(req.params.page) || 1;
  const limit = parseInt(req.params.limit) || 6;

  const boardService = new BoardService();
  const result = await boardService.getBoardListByCategory(
    category,
    page,
    limit
  );

  res.status(200).json(result);
};

export const getRecentMainList = async (req: Request, res: Response) => {
  const result = await boardService.getRecentMainList();
  res.status(200).json(result); // ✅ 올바른 구조
};

export const getTilMainList = async (req: Request, res: Response) => {
  const result = await boardService.getTilMainList();
  res.status(200).json(result); // ✅ 올바른 구조
};

export const getDiaryMainList = async (req: Request, res: Response) => {
  const result = await boardService.getDiaryMainList();
  res.status(200).json(result); // ✅ 올바른 구조
};
