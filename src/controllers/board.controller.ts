import { Request, Response } from "express";
import { BoardService } from "../service/board.service";

const boardService = new BoardService();

export const getAllBoardList = async (req: Request, res: Response) => {
  const result = await boardService.getAllBoardList();
  res.json(result);
};

export const getTilList = async (req: Request, res: Response) => {
  const reuslt = await boardService.getTilList();
  res.json(reuslt);
};

export const getDiaryList = async (req: Request, res: Response) => {
  const result = await boardService.getDiaryList();
  res.json(result);
};

export const getRecentMainList = async (req: Request, res: Response) => {
  const result = await boardService.getRecentMainList();
  res.json(result);
};

export const getTilMainList = async (req: Request, res: Response) => {
  const result = await boardService.getTilMainList();
  res.json(result);
};

export const getDiaryMainList = async (req: Request, res: Response) => {
  const result = await boardService.getDiaryMainList();
  res.json(result);
};
