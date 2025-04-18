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
} from "../controllers/board.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/main-recent", getRecentMainList);
router.get("/main-til", getTilMainList);
router.get("/main-diary", getDiaryMainList);
router.get("/stats/views/monthly", getMonthlyViews);
router.get("/detail/:id", getBoardDetail);
router.get("/:page/:limit", getAllBoardList);
router.get("/:category/:page/:limit", getBoardsByCategory);

router.post("/", verifyToken, createBoard);

export default router;
