import { Request, Response } from "express";
import { BoardService } from "../service/board.service";
import { CreateBoardDto } from "../dto/boards/board.create.dto";
import { UpdateBoardDto } from "../dto/boards/board.update.dto";

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

export const deleteBoard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: "유효하지 않은 게시글 ID입니다." });
      return;
    }

    await boardService.deleteBoard(id);
    res.status(200).json({ message: "게시글이 삭제되었습니다." });
  } catch (error) {
    console.error("게시글 삭제 오류:", error);
    res.status(500).json({ message: "게시글 삭제 실패" });
  }
};

export const updateBoard = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const dto: UpdateBoardDto = req.body;

  try {
    const updatedBoard = await boardService.updateBoard(dto, parseInt(id));
    res.status(200).json(updatedBoard);
  } catch (error) {
    console.error("게시글 수정 오류:", error);
    res.status(500).json({ message: "게시글 수정에 실패했습니다." });
  }
};

export const searchBoards = async (
  req: Request,
  res: Response
): Promise<void> => {
  const keyword = req.query.keyword as string;

  if (!keyword) {
    res.status(400).json({ message: "검색어가 필요합니다." });
    return;
  }

  try {
    const result = await boardService.searchBoards(keyword);
    res.status(200).json(result);
  } catch (error) {
    console.error("검색 오류:", error);
    res.status(500).json({ message: "검색에 실패했습니다." });
  }
};

export const getBoardStats = async (req: Request, res: Response) => {
  try {
    const stats = await boardService.getBoardStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error("게시판 통계 오류:", error);
    res.status(500).json({ message: "게시판 통계 조회 실패" });
  }
};
