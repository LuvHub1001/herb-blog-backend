import { Router } from "express";
import {
  getAllBoardList,
  getBoardsByCategory,
  getDiaryMainList,
  getRecentMainList,
  getTilMainList,
  createBoard,
  getBoardDetail,
} from "../controllers/board.controller";

const router = Router();

router.get("/main-recent", getRecentMainList);
router.get("/main-til", getTilMainList);
router.get("/main-diary", getDiaryMainList);
router.get("/detail/:id", getBoardDetail);
router.get("/:page/:limit", getAllBoardList);
router.get("/:category/:page/:limit", getBoardsByCategory);

router.post("/", createBoard);

export default router;
