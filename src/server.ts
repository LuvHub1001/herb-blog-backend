import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import prisma from "./config/prisma";
import { validateEnv } from "./config/env";
import logger from "./config/logger";
import { sendErrorAlert } from "./utils/discord";
import { startHealthCheckScheduler } from "./utils/scheduler";
import { startViewCountFlusher, stopViewCountFlusher } from "./utils/viewCountBuffer";

// 환경변수 검증
validateEnv();

const PORT = process.env.PORT || 5000;

// DB 연결 확인 + 서버 시작
prisma
  .$connect()
  .then(() => {
    logger.info("DB 연결 확인");

    const server = app.listen(PORT, () => {
      logger.info(`서버 구동 중 >> http://localhost:${PORT}`);
    });

    // 아침 서버 점검 스케줄러 시작
    startHealthCheckScheduler();

    // 조회수 버퍼 플러셔 시작 (60초 간격 배치 반영)
    startViewCountFlusher();

    // Graceful shutdown
    const shutdown = (signal: string) => {
      logger.info(`${signal} 수신 — 서버 종료 시작`);

      server.close(async () => {
        logger.info("HTTP 서버 종료 완료");

        try {
          // 조회수 버퍼 최종 반영 후 DB 해제
          await stopViewCountFlusher();
          await prisma.$disconnect();
          logger.info("DB 연결 해제 완료");
        } catch (err) {
          logger.error("DB 연결 해제 실패", { error: (err as Error).message });
        }

        process.exit(0);
      });

      setTimeout(() => {
        logger.error("Graceful shutdown 타임아웃 — 강제 종료");
        process.exit(1);
      }, 30000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  })
  .catch((error: Error) => {
    logger.error("DB 연결 오류", { error: error.message });
    sendErrorAlert(new Error(`DB 연결 오류: ${error.message}`));
    process.exit(1);
  });

// 처리되지 않은 에러 캐치
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection", { reason });
  const err = reason instanceof Error ? reason : new Error(String(reason));
  sendErrorAlert(err, { Type: "Unhandled Rejection" });
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", { message: error.message, stack: error.stack });
  sendErrorAlert(error, { Type: "Uncaught Exception" });
  process.exit(1);
});
