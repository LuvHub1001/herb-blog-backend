import rateLimit from "express-rate-limit";

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
  message: { success: false, error: "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요." },
});

// 검색 API 제한: 프로덕션 1분당 20회 / 개발 무제한
export const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: isDev ? 10000 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "검색 요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
});
