import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { loginUser } from "../service/auth.service";

export const login = async (req: Request, res: Response) => {
  const { id, password } = req.body;

  try {
    const token = await loginUser(id, password);
    res.status(200).json({ token });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const verifyTokenController = async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "토큰이 없습니다." });
    return;
  }

  try {
    const decoded = await new Promise<any>((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    res.status(200).json({
      message: "토큰 유효",
      user: {
        id: decoded.userId,
        role: decoded.role,
        email: decoded.email,
      },
    });
  } catch (err) {
    res.status(403).json({ message: "유효하지 않은 토큰입니다." });
  }
};
