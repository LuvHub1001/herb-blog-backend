import { Router } from "express";
import {
  getAllBoardList,
  getBoardsByCategory,
  getDiaryMainList,
  getRecentMainList,
  getTilMainList,
  createBoard,
  getBoardDetail,
  getBoardStats,
  deleteBoard,
  updateBoard,
  searchBoards,
} from "../controllers/board.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { searchLimiter } from "../middleware/rateLimiter";
import { CreateBoardDto } from "../dto/boards/board.create.dto";
import { UpdateBoardDto } from "../dto/boards/board.update.dto";

const router = Router();

router.get("/main-recent", getRecentMainList);
router.get("/main-til", getTilMainList);
router.get("/main-diary", getDiaryMainList);
router.get("/search", searchLimiter, searchBoards);
router.get("/stats", getBoardStats);
router.get("/detail/:id", getBoardDetail);
router.get("/:page/:limit", getAllBoardList);
router.get("/:category/:page/:limit", getBoardsByCategory);

router.post("/", verifyToken, validate(CreateBoardDto), createBoard);
router.patch("/:id", verifyToken, validate(UpdateBoardDto), updateBoard);
router.delete("/:id", verifyToken, deleteBoard);

export default router;
