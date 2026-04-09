import { Router } from "express";
import { getVisitorStats, createVisitor } from "../controllers/visitor.controller";
import { validate } from "../middleware/validate";
import { CreateVisitorDto } from "../dto/visitors/visitor.create.dto";

const router = Router();

router.get("/stats", getVisitorStats);
router.post("/", validate(CreateVisitorDto), createVisitor);

export default router;
