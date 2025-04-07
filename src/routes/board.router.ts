import { Router } from "express";
import { getBoardList } from "../controllers/board.controller";

const router = Router();

router.get("/", getBoardList);

export default router;
