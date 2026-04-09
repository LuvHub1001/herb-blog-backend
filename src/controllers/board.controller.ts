import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { BoardService } from "../service/board.service";

const boardService = new BoardService();

// 페이지네이션 파라미터 검증 (DoS 방지)
const parsePage = (val: string) => Math.max(1, parseInt(val, 10) || 1);
const parseLimit = (val: string) => Math.min(Math.max(1, parseInt(val, 10) || 8), 100);

export const getAllBoardList = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parsePage(req.params.page);
    const limit = parseLimit(req.params.limit);
    const result = await boardService.getAllBoardList(page, limit);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getBoardsByCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const category = req.params.category;
    const page = parsePage(req.params.page);
    const limit = parseLimit(req.params.limit);
    const result = await boardService.getBoardListByCategory(category, page, limit);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getRecentMainList = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await boardService.getRecentMainList();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getTilMainList = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await boardService.getTilMainList();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getDiaryMainList = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await boardService.getDiaryMainList();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const createBoard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // writer를 인증된 사용자로 강제 설정 (위조 방지)
    const dto = { ...req.body, writer: req.user };
    const newBoard = await boardService.createBoard(dto);
    res.status(201).json({ success: true, data: newBoard });
  } catch (error) {
    next(error);
  }
};

export const getBoardDetail = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: "유효하지 않은 게시글 ID입니다." });
      return;
    }
    const result = await boardService.getBoardDetail(id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const deleteBoard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: "유효하지 않은 게시글 ID입니다." });
      return;
    }
    await boardService.deleteBoard(id, req.user!);
    res.status(200).json({ success: true, data: { message: "게시글이 삭제되었습니다." } });
  } catch (error) {
    next(error);
  }
};

export const updateBoard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: "유효하지 않은 게시글 ID입니다." });
      return;
    }
    const updatedBoard = await boardService.updateBoard(req.body, id, req.user!);
    res.status(200).json({ success: true, data: updatedBoard });
  } catch (error) {
    next(error);
  }
};

export const searchBoards = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const keyword = (req.query.keyword as string || "").trim();
    if (!keyword || keyword.length > 100) {
      res.status(400).json({ success: false, error: "검색어가 필요합니다. (최대 100자)" });
      return;
    }
    const page = parsePage(req.query.page as string || "1");
    const limit = parseLimit(req.query.limit as string || "20");
    const result = await boardService.searchBoards(keyword, page, limit);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getBoardStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await boardService.getBoardStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};
