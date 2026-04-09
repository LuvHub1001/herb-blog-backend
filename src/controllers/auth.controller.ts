import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { loginUser } from "../service/auth.service";

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, password } = req.body;
    const token = await loginUser(id, password);
    res.status(200).json({ success: true, data: { token } });
  } catch (error) {
    res.status(401).json({ success: false, error: "아이디 또는 비밀번호가 올바르지 않습니다." });
  }
};

export const verifyTokenController = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ success: false, error: "토큰이 없습니다." });
    return;
  }

  try {
    const decoded = await new Promise<any>((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET as string, { algorithms: ["HS256"] }, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: decoded.userId,
          role: decoded.role,
          email: decoded.email,
        },
      },
    });
  } catch (err) {
    res.status(403).json({ success: false, error: "유효하지 않은 토큰입니다." });
  }
};
