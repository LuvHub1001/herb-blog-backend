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

  const entries = [...snapshot.entries()];
  const results = await Promise.allSettled(
    entries.map(([id, count]) =>
      // updateMany: 대상이 없어도 예외 없이 count:0 반환 → 삭제된 게시글은 자연스럽게 드롭
      prisma.board.updateMany({
        where: { id },
        data: { viewCount: { increment: count } },
      })
    )
  );

  let ok = 0;
  let dropped = 0;
  let failed = 0;
  results.forEach((res, i) => {
    const [id, count] = entries[i];
    if (res.status === "fulfilled") {
      if (res.value.count === 0) {
        dropped++; // 존재하지 않는 게시글 — 재시도하지 않음
      } else {
        ok++;
      }
    } else {
      // 일시적 DB 오류로 간주 — 해당 항목만 버퍼에 되돌림
      failed++;
      viewBuffer.set(id, (viewBuffer.get(id) ?? 0) + count);
      logger.error("조회수 버퍼 반영 실패", {
        boardId: id,
        error: (res.reason as Error)?.message,
      });
    }
  });

  if (ok || dropped || failed) {
    logger.debug(
      `조회수 버퍼 반영: 성공 ${ok}건, 드롭 ${dropped}건, 실패 ${failed}건`
    );
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
