import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";
import { sendErrorAlert } from "../utils/discord";

// 클라이언트에 안전하게 노출할 수 있는 비즈니스 에러 메시지 패턴
const SAFE_ERROR_PATTERNS: { test: (msg: string) => boolean; status: number }[] = [
  { test: (msg) => msg === "권한이 없습니다.", status: 403 },
  { test: (msg) => msg.includes("찾을 수 없습니다"), status: 404 },
  { test: (msg) => msg.includes("초과할 수 없습니다"), status: 400 },
  { test: (msg) => msg.includes("허용되지 않는"), status: 400 },
  { test: (msg) => msg.includes("파일 형식이"), status: 400 },
  { test: (msg) => msg.includes("올바르지 않습니다"), status: 400 },
];

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const requestId = (req as any).requestId || "unknown";

  logger.error("Unhandled error", {
    requestId,
    method: req.method,
    url: req.originalUrl,
    message: err.message,
  });

  // 비즈니스 로직 에러 — 안전한 메시지만 클라이언트에 전달
  for (const pattern of SAFE_ERROR_PATTERNS) {
    if (pattern.test(err.message)) {
      res.status(pattern.status).json({ success: false, error: err.message });
      return;
    }
  }

  // Prisma 에러, DB 에러 등 내부 에러 — 상세 메시지 숨김
  sendErrorAlert(err, {
    "Request ID": requestId,
    Method: req.method,
    URL: req.originalUrl,
  });

  res.status(500).json({
    success: false,
    error: "서버 내부 오류가 발생했습니다.",
  });
};
