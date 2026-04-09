import prisma from "../config/prisma";
import { supabase } from "../config/supabase";
import logger from "../config/logger";
import { sendHealthReport, sendErrorAlert } from "./discord";

async function runHealthCheck(): Promise<void> {
  logger.info("서버 점검 시작");

  const report: Record<string, unknown> = {};

  // 1. DB 연결 상태
  try {
    await prisma.$queryRaw`SELECT 1`;
    report["DB 상태"] = "✅ 정상";
  } catch (err) {
    report["DB 상태"] = `❌ 연결 실패: ${(err as Error).message}`;
  }

  // 2. Supabase Storage 상태
  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) throw error;
    report["Storage 상태"] = `✅ 정상 (버킷 ${data.length}개)`;
  } catch (err) {
    report["Storage 상태"] = `❌ 연결 실패: ${(err as Error).message}`;
  }

  // 3. 메모리 사용량
  const mem = process.memoryUsage();
  report["메모리"] = {
    rss: `${(mem.rss / 1024 / 1024).toFixed(1)}MB`,
    heapUsed: `${(mem.heapUsed / 1024 / 1024).toFixed(1)}MB`,
    heapTotal: `${(mem.heapTotal / 1024 / 1024).toFixed(1)}MB`,
  };

  // 4. 서버 Uptime
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  report["Uptime"] = `${hours}시간 ${minutes}분`;

  // 5. DB 통계
  try {
    const boardCount = await prisma.board.count();
    const visitorCount = await prisma.visitor.count();
    report["통계"] = {
      게시글: `${boardCount}개`,
      방문자: `${visitorCount}건`,
    };
  } catch (err) {
    report["통계"] = `조회 실패: ${(err as Error).message}`;
  }

  logger.info("서버 점검 완료", { report });
  await sendHealthReport(report);
}

function getMillisUntilNextRun(targetHour: number): number {
  const now = new Date();
  const next = new Date(now);
  next.setHours(targetHour, 0, 0, 0);

  if (next.getTime() <= now.getTime()) {
    next.setDate(next.getDate() + 1);
  }

  return next.getTime() - now.getTime();
}

export function startHealthCheckScheduler(): void {
  const TARGET_HOUR = 9;

  const scheduleNext = () => {
    const ms = getMillisUntilNextRun(TARGET_HOUR);
    const hours = (ms / 1000 / 3600).toFixed(1);
    logger.info(`다음 서버 점검: ${hours}시간 후`);

    setTimeout(async () => {
      try {
        await runHealthCheck();
      } catch (err) {
        logger.error("서버 점검 실패", { error: (err as Error).message });
        await sendErrorAlert(err as Error, { Type: "Health Check 실패" });
      }
      scheduleNext();
    }, ms);
  };

  scheduleNext();
}
