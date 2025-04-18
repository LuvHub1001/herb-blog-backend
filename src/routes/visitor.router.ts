import { Router } from "express";
import {
  getAllVisitors,
  getVisitorStats,
  createVisitor,
} from "../controllers/visitor.controller";

const router = Router();

router.get("/stats", getVisitorStats);
router.get("/:page/:limit", getAllVisitors);
router.post("/", createVisitor);

export default router;
