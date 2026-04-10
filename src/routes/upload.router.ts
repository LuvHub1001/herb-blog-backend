import { Router } from "express";
import multer from "multer";
import { uploadImage, deleteImage } from "../controllers/upload.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { noCache } from "../middleware/cacheControl";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const router = Router();

// 모든 업로드/삭제 엔드포인트는 인증 필수 (관리자 전용)
router.post("/", verifyToken, noCache, upload.single("image"), uploadImage);
router.delete("/", verifyToken, noCache, deleteImage);

export default router;
