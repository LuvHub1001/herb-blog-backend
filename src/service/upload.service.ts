import { supabase } from "../config/supabase";
import { fromBuffer } from "file-type";
import crypto from "crypto";
import logger from "../config/logger";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const BUCKET_NAME = "blog-images";

type AllowedMime = (typeof ALLOWED_MIME_TYPES)[number];

const MIME_TO_EXT: Record<AllowedMime, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export class UploadService {
  // 파일 검증: MIME + 매직넘버 이중 검증
  async validateImage(buffer: Buffer, originalMime: string): Promise<string> {
    // 크기 검증
    if (buffer.length > MAX_FILE_SIZE) {
      throw new Error("파일 크기는 5MB를 초과할 수 없습니다.");
    }

    // 매직넘버 기반 실제 타입 검증
    const detected = await fromBuffer(buffer);
    if (!detected || !ALLOWED_MIME_TYPES.includes(detected.mime as AllowedMime)) {
      throw new Error("허용되지 않는 파일 형식입니다. (jpg, png, webp, gif만 가능)");
    }

    // Content-Type과 실제 파일 타입 일치 여부 확인
    if (originalMime !== detected.mime) {
      logger.warn("MIME 타입 불일치", { claimed: originalMime, actual: detected.mime });
      throw new Error("파일 형식이 올바르지 않습니다.");
    }

    return detected.mime;
  }

  async uploadImage(buffer: Buffer, originalMime: string): Promise<string> {
    const mime = await this.validateImage(buffer, originalMime);

    // 안전한 파일명 생성 (UUID + 확장자)
    const ext = MIME_TO_EXT[mime as AllowedMime];
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const filePath = `posts/${fileName}`;

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: mime,
        upsert: false,
      });

    if (error) {
      logger.error("Supabase Storage 업로드 실패", { error: error.message });
      throw new Error("이미지 업로드에 실패했습니다.");
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    return data.publicUrl;
  }

  async deleteImage(imageUrl: string): Promise<void> {
    // URL에서 파일 경로 추출
    const match = imageUrl.match(/blog-images\/(.+)$/);
    if (!match) return;

    const filePath = match[1];
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);

    if (error) {
      logger.error("Supabase Storage 삭제 실패", { error: error.message, filePath });
    }
  }
}
