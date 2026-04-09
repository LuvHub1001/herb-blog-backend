import { Router } from "express";
import { login, verifyTokenController } from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { LoginDto } from "../dto/auth/login.dto";

const router = Router();

router.get("/verify", verifyTokenController);
router.post("/login", validate(LoginDto), login);

export default router;
