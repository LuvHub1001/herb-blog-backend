import { Router } from "express";
import { login, verifyTokenController } from "../controllers/auth.controller";

const router = Router();

router.get("/verify", verifyTokenController);
router.post("/login", login);

export default router;
