import prisma from "../config/prisma";
import { BoardResponseDto } from "../dto/boards/board.response.dto";
import { CreateBoardDto } from "../dto/boards/board.create.dto";
import { UpdateBoardDto } from "../dto/boards/board.update.dto";

// 목록 API용 select — content 제외 (대용량 필드)
const BOARD_LIST_SELECT = {
  id: true,
  writer: true,
  title: true,
  subTitle: true,
  subContent: true,
  thumbnail: true,
  category: true,
  viewCount: true,
  workdate: true,
} as const;

export class BoardService {
  async getAllBoardList(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [boards, totalCount] = await Promise.all([
      prisma.board.findMany({
        select: BOARD_LIST_SELECT,
        skip,
        take: limit,
        orderBy: { id: "desc" },
      }),
      prisma.board.count(),
    ]);

    return {
      res: boards,
      totalCount,
      startIndex: skip + 1,
      endIndex: Math.min(skip + limit, totalCount),
    };
  }

  async getBoardListByCategory(category: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [boards, totalCount] = await Promise.all([
      prisma.board.findMany({
        select: BOARD_LIST_SELECT,
        where: { category },
        skip,
        take: limit,
        orderBy: { id: "desc" },
      }),
      prisma.board.count({ where: { category } }),
    ]);

    return {
      res: boards,
      totalCount,
      startIndex: skip + 1,
      endIndex: Math.min(skip + limit, totalCount),
    };
  }

  async getRecentMainList() {
    return await prisma.board.findMany({
      select: BOARD_LIST_SELECT,
      take: 3,
      orderBy: { id: "desc" },
    });
  }

  async getTilMainList() {
    return await prisma.board.findMany({
      select: BOARD_LIST_SELECT,
      where: { category: "til" },
      take: 4,
      orderBy: { id: "desc" },
    });
  }

  async getDiaryMainList() {
    return await prisma.board.findMany({
      select: BOARD_LIST_SELECT,
      where: { category: "diary" },
      take: 4,
      orderBy: { id: "desc" },
    });
  }

  async createBoard(dto: CreateBoardDto) {
    return await prisma.board.create({ data: dto });
  }

  async getBoardDetail(id: number): Promise<BoardResponseDto> {
    const board = await prisma.board.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
    if (!board) throw new Error("게시글을 찾을 수 없습니다.");

    return new BoardResponseDto(board);
  }

  async deleteBoard(id: number, username: string): Promise<void> {
    const board = await prisma.board.findUnique({ where: { id } });
    if (!board) throw new Error("게시글을 찾을 수 없습니다.");
    if (board.writer !== username) throw new Error("권한이 없습니다.");
    await prisma.board.delete({ where: { id } });
  }

  async updateBoard(dto: UpdateBoardDto, id: number, username: string) {
    const board = await prisma.board.findUnique({ where: { id } });
    if (!board) throw new Error("게시글을 찾을 수 없습니다.");
    if (board.writer !== username) throw new Error("권한이 없습니다.");
    return await prisma.board.update({ where: { id }, data: dto });
  }

  async searchBoards(keyword: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50);

    const [boards, totalCount] = await Promise.all([
      prisma.board.findMany({
        select: BOARD_LIST_SELECT,
        where: {
          OR: [
            { title: { contains: keyword, mode: "insensitive" } },
            { content: { contains: keyword, mode: "insensitive" } },
          ],
        },
        skip,
        take,
        orderBy: { id: "desc" },
      }),
      prisma.board.count({
        where: {
          OR: [
            { title: { contains: keyword, mode: "insensitive" } },
            { content: { contains: keyword, mode: "insensitive" } },
          ],
        },
      }),
    ]);

    return { res: boards, totalCount };
  }

  async getBoardStats() {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    const [todayResult, yesterdayResult, totalResult, monthlyResult] = await Promise.all([
      prisma.$queryRaw<[{ sum: bigint | null }]>`
        SELECT COALESCE(SUM("viewCount"), 0) as sum FROM board WHERE DATE(workdate) = ${today}::date`,
      prisma.$queryRaw<[{ sum: bigint | null }]>`
        SELECT COALESCE(SUM("viewCount"), 0) as sum FROM board WHERE DATE(workdate) = ${yesterday}::date`,
      prisma.$queryRaw<[{ sum: bigint | null }]>`
        SELECT COALESCE(SUM("viewCount"), 0) as sum FROM board`,
      prisma.$queryRaw<{ month: string; totalViews: bigint }[]>`
        SELECT TO_CHAR(workdate, 'YYYY-MM') as month, COALESCE(SUM("viewCount"), 0) as "totalViews"
        FROM board GROUP BY month ORDER BY month DESC`,
    ]);

    return {
      today: Number(todayResult[0].sum),
      yesterday: Number(yesterdayResult[0].sum),
      total: Number(totalResult[0].sum),
      monthly: monthlyResult.map((r) => ({ month: r.month, totalViews: Number(r.totalViews) })),
    };
  }
}
