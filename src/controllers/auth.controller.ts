import { Request, Response } from "express";
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
