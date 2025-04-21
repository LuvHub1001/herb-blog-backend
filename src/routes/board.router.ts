import { Router } from "express";
import {
  getAllBoardList,
  getBoardsByCategory,
  getDiaryMainList,
  getRecentMainList,
  getTilMainList,
  createBoard,
  getBoardDetail,
  getMonthlyViews,
  deleteBoard,
  updateBoard,
  searchBoards,
} from "../controllers/board.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/main-recent", getRecentMainList);
router.get("/main-til", getTilMainList);
router.get("/main-diary", getDiaryMainList);
router.get("/search", searchBoards);
router.patch("/:id", verifyToken, updateBoard);
router.get("/stats/views/monthly", getMonthlyViews);
router.get("/detail/:id", getBoardDetail);
router.get("/:page/:limit", getAllBoardList);
router.get("/:category/:page/:limit", getBoardsByCategory);

router.delete("/:id", verifyToken, deleteBoard);

router.post("/", verifyToken, createBoard);

export default router;
