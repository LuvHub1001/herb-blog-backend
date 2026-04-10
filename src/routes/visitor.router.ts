import { Router } from "express";
import { getVisitorStats, createVisitor } from "../controllers/visitor.controller";
import { validate } from "../middleware/validate";
import { CreateVisitorDto } from "../dto/visitors/visitor.create.dto";
import { longCache } from "../middleware/cacheControl";

const router = Router();

router.get("/stats", longCache, getVisitorStats);
router.post("/", validate(CreateVisitorDto), createVisitor);

export default router;
