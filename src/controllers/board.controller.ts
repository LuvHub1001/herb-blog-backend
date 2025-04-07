import { Request, Response } from "express";
import { BoardService } from "../service/board.service";

const boardService = new BoardService();

export const getBoardList = async (req: Request, res: Response) => {
  const result = await boardService.getAllBoards();
  res.json(result);
};
