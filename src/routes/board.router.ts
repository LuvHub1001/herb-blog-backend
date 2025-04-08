import { Router } from "express";
import {
  getAllBoardList,
  getDiaryList,
  getTilList,
} from "../controllers/board.controller";

const router = Router();

router.get("/", getAllBoardList);
router.get("/diary", getDiaryList);
router.get("/til", getTilList);

export default router;
