import { Router } from "express";
import { login, verifyTokenController } from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { LoginDto } from "../dto/auth/login.dto";
import { loginLimiter } from "../middleware/rateLimiter";

const router = Router();

router.get("/verify", verifyTokenController);
router.post("/login", loginLimiter, validate(LoginDto), login);

export default router;
