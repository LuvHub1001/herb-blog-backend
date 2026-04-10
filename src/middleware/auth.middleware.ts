import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: string;
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ success: false, error: "토큰이 없습니다." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string, {
      algorithms: ["HS256"],
    }) as { username: string };

    req.user = decoded.username;
    next();
  } catch (error) {
    // 만료된 토큰은 403, 그 외 인증 실패는 401
    if (error instanceof jwt.TokenExpiredError) {
      res.status(403).json({ success: false, error: "토큰이 만료되었습니다." });
      return;
    }
    res.status(401).json({ success: false, error: "유효하지 않은 토큰입니다." });
  }
};
