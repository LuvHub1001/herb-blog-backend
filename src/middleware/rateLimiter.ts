import rateLimit from "express-rate-limit";
import logger from "../config/logger";

const isDev = process.env.NODE_ENV !== "production";

// 일반 API 제한: 프로덕션 15분당 100회 / 개발 15분당 10000회
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 10000 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
});

// 인증 API 제한: 프로덕션 15분당 10회 / 개발 15분당 10000회
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 10000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
});

// 로그인 전용 제한: 프로덕션 10분당 20회 (실패 시도만 카운트, brute force 방지)
export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: isDev ? 10000 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { success: false, error: "너무 많은 로그인 시도. 잠시 후 다시 시도해주세요." },
  // 차단 발생 시 로깅 — 공격 IP 추적용
  handler: (req, res, _next, options) => {
    logger.warn("로그인 rate limit 차단", {
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      path: req.originalUrl,
    });
    res.status(options.statusCode).json(options.message);
  },
});

// 검색 API 제한: 프로덕션 1분당 20회 / 개발 무제한
export const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: isDev ? 10000 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "검색 요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
});
