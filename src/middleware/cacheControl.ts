import { Request, Response, NextFunction } from "express";

// 공개 읽기 API용 — 짧은 TTL (게시글 목록/상세)
export const shortCache = (_req: Request, res: Response, next: NextFunction): void => {
  res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=30");
  next();
};

// 변화가 적은 데이터용 — 긴 TTL (통계, 메인 목록)
export const longCache = (_req: Request, res: Response, next: NextFunction): void => {
  res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=60");
  next();
};

// 인증 필요 API용 — 캐시 금지
export const noCache = (_req: Request, res: Response, next: NextFunction): void => {
  res.set("Cache-Control", "private, no-store");
  next();
};
