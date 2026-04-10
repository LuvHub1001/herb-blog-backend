import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { UploadService } from "../service/upload.service";

const uploadService = new UploadService();

export const uploadImage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: "이미지 파일이 필요합니다." });
      return;
    }

    const url = await uploadService.uploadImage(req.file.buffer, req.file.mimetype);
    res.status(201).json({ success: true, data: { url } });
  } catch (error) {
    next(error);
  }
};

export const deleteImage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== "string") {
      res.status(400).json({ success: false, error: "삭제할 이미지 URL이 필요합니다." });
      return;
    }

    await uploadService.deleteImage(url);
    res.status(200).json({ success: true, data: { message: "이미지가 삭제되었습니다." } });
  } catch (error) {
    next(error);
  }
};
