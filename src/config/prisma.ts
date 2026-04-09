import { PrismaClient } from "@prisma/client";
import logger from "./logger";

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV !== "production"
      ? [
          { emit: "event", level: "query" },
          { emit: "stdout", level: "warn" },
          { emit: "stdout", level: "error" },
        ]
      : [{ emit: "stdout", level: "error" }],
});

// 슬로우 쿼리 로깅 (200ms 초과)
if (process.env.NODE_ENV !== "production") {
  prisma.$on("query" as never, (e: any) => {
    if (e.duration > 200) {
      logger.warn(`Slow query (${e.duration}ms): ${e.query}`);
    }
  });
}

export default prisma;
