import logger from "./logger";

const requiredEnvVars = [
  "DATABASE_URL",
  "JWT_SECRET",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

export function validateEnv(): void {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    logger.error("필수 환경변수 누락", { missing });
    process.exit(1);
  }

  logger.info("환경변수 검증 완료");
}
