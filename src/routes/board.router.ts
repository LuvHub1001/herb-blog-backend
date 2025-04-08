import { Router } from "express";
import {
  getAllBoardList,
  getDiaryList,
  getDiaryMainList,
  getRecentMainList,
  getTilList,
  getTilMainList,
} from "../controllers/board.controller";

const router = Router();

router.get("/", getAllBoardList);
router.get("/diary", getDiaryList);
router.get("/til", getTilList);

router.get("/main-recent", getRecentMainList);
router.get("/main-til", getTilMainList);
router.get("/main-diary", getDiaryMainList);

export default router;
