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
import { shortCache, longCache, noCache } from "../middleware/cacheControl";
import { CreateBoardDto } from "../dto/boards/board.create.dto";
import { UpdateBoardDto } from "../dto/boards/board.update.dto";

const router = Router();

router.get("/main-recent", longCache, getRecentMainList);
router.get("/main-til", longCache, getTilMainList);
router.get("/main-diary", longCache, getDiaryMainList);
router.get("/search", searchLimiter, shortCache, searchBoards);
router.get("/stats", longCache, getBoardStats);
router.get("/detail/:id", shortCache, getBoardDetail);
router.get("/:page/:limit", shortCache, getAllBoardList);
router.get("/:category/:page/:limit", shortCache, getBoardsByCategory);

router.post("/", verifyToken, noCache, validate(CreateBoardDto), createBoard);
router.patch("/:id", verifyToken, noCache, validate(UpdateBoardDto), updateBoard);
router.delete("/:id", verifyToken, noCache, deleteBoard);

export default router;
