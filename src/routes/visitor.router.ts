import { Router } from "express";
import {
  getVisitorStats,
  createVisitor,
} from "../controllers/visitor.controller";

const router = Router();

router.get("/stats", getVisitorStats);
router.post("/", createVisitor);

export default router;
