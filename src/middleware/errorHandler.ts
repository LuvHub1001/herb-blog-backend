import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";
import { sendErrorAlert } from "../utils/discord";

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

  // 권한 에러는 403 반환
  if (err.message === "권한이 없습니다.") {
    res.status(403).json({ success: false, error: err.message });
    return;
  }

  // 리소스 없음
  if (err.message.includes("찾을 수 없습니다")) {
    res.status(404).json({ success: false, error: err.message });
    return;
  }

  // 500 에러만 Discord 알림 전송 (4xx는 정상 흐름)
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
