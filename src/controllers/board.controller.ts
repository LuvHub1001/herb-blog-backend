import { Request, Response } from "express";
import { BoardService } from "../service/board.service";
import { CreateBoardDto } from "../dto/boards/board.create.dto";

const boardService = new BoardService();

export const getAllBoardList = async (req: Request, res: Response) => {
  const page = parseInt(req.params.page) || 1;
  const limit = parseInt(req.params.limit) || 8;

  const result = await boardService.getAllBoardList(page, limit);

  res.status(200).json(result);
};

export const getBoardsByCategory = async (req: Request, res: Response) => {
  const category = req.params.category;
  const page = parseInt(req.params.page) || 1;
  const limit = parseInt(req.params.limit) || 8;

  const result = await boardService.getBoardListByCategory(
    category,
    page,
    limit
  );

  res.status(200).json(result);
};

export const getRecentMainList = async (req: Request, res: Response) => {
  const result = await boardService.getRecentMainList();
  res.status(200).json(result);
};

export const getTilMainList = async (req: Request, res: Response) => {
  const result = await boardService.getTilMainList();
  res.status(200).json(result);
};

export const getDiaryMainList = async (req: Request, res: Response) => {
  const result = await boardService.getDiaryMainList();
  res.status(200).json(result);
};

export const createBoard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dto: CreateBoardDto = req.body;
    const newBoard = await boardService.createBoard(dto);
    res.status(201).json(newBoard);
  } catch (error) {
    console.error("게시글 생성 오류:", error);
    res.status(500).json({ message: "게시글 생성 실패" });
  }
};

export const getBoardDetail = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const result = await boardService.getBoardDetail(id);
  res.status(200).json(result);
};
