import { Router } from "express";
import { getVisitorStats, createVisitor } from "../controllers/visitor.controller";
import { longCache } from "../middleware/cacheControl";

const router = Router();

router.get("/stats", longCache, getVisitorStats);
router.post("/", createVisitor);

export default router;
