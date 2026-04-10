import prisma from "../config/prisma";
import logger from "../config/logger";

// 조회수 인메모리 버퍼 — 요청마다 UPDATE 대신 주기적 배치 반영
const viewBuffer = new Map<number, number>();

const FLUSH_INTERVAL = 60_000; // 1분

export function incrementViewCount(boardId: number): void {
  viewBuffer.set(boardId, (viewBuffer.get(boardId) ?? 0) + 1);
}

export function getBufferedCount(boardId: number): number {
  return viewBuffer.get(boardId) ?? 0;
}

async function flushViewCounts(): Promise<void> {
  if (viewBuffer.size === 0) return;

  const snapshot = new Map(viewBuffer);
  viewBuffer.clear();

  try {
    await Promise.all(
      [...snapshot.entries()].map(([id, count]) =>
        prisma.board.update({
          where: { id },
          data: { viewCount: { increment: count } },
        })
      )
    );
    logger.debug(`조회수 버퍼 반영 완료: ${snapshot.size}건`);
  } catch (err) {
    // 실패 시 버퍼에 다시 추가
    for (const [id, count] of snapshot) {
      viewBuffer.set(id, (viewBuffer.get(id) ?? 0) + count);
    }
    logger.error("조회수 버퍼 반영 실패", { error: (err as Error).message });
  }
}

let intervalId: ReturnType<typeof setInterval> | null = null;

export function startViewCountFlusher(): void {
  if (intervalId) return;
  intervalId = setInterval(flushViewCounts, FLUSH_INTERVAL);
  logger.info("조회수 버퍼 플러셔 시작 (60초 간격)");
}

export async function stopViewCountFlusher(): Promise<void> {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  // 종료 전 남은 버퍼 반영
  await flushViewCounts();
  logger.info("조회수 버퍼 최종 반영 완료");
}
