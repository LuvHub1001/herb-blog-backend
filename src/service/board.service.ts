import { Board } from "../entities/board.entity";
import { AppDataSource } from "../config/data-source";
import { BoardResponseDto } from "../dto/boards/board.response.dto";
import { CreateBoardDto } from "../dto/boards/board.create.dto";
import { UpdateBoardDto } from "../dto/boards/board.update.dto";
import { Like } from "typeorm";

export class BoardService {
  private boardRepo = AppDataSource.getRepository(Board);

  async getAllBoardList(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [boards, totalCount] = await this.boardRepo.findAndCount({
      skip,
      take: limit,
      order: { id: "DESC" },
    });

    const startIndex = skip + 1;
    const endIndex = Math.min(skip + limit, totalCount);

    return {
      res: boards,
      totalCount,
      startIndex,
      endIndex,
    };
  }

  async getBoardListByCategory(category: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [boards, totalCount] = await this.boardRepo.findAndCount({
      where: { category },
      skip,
      take: limit,
      order: { id: "DESC" },
    });

    const startIndex = skip + 1;
    const endIndex = Math.min(skip + limit, totalCount);

    return {
      res: boards,
      totalCount,
      startIndex,
      endIndex,
    };
  }

  async getRecentMainList(): Promise<BoardResponseDto[]> {
    const recentMainList = await this.boardRepo.find({
      take: 3,
      order: {
        id: "DESC",
      },
    });
    return recentMainList.map((board) => new BoardResponseDto(board));
  }

  async getTilMainList(): Promise<BoardResponseDto[]> {
    const tilMainList = await this.boardRepo.find({
      take: 4,
      where: {
        category: "til",
      },
      order: {
        id: "DESC",
      },
    });
    return tilMainList.map((til) => new BoardResponseDto(til));
  }

  async getDiaryMainList(): Promise<BoardResponseDto[]> {
    const diaryMainList = await this.boardRepo.find({
      take: 4,
      where: {
        category: "diary",
      },
      order: {
        id: "DESC",
      },
    });
    return diaryMainList.map((diary) => new BoardResponseDto(diary));
  }

  async createBoard(dto: CreateBoardDto): Promise<Board> {
    const board = this.boardRepo.create(dto);
    return await this.boardRepo.save(board);
  }

  async getBoardDetail(id: number): Promise<BoardResponseDto | null> {
    const board = await this.boardRepo.findOne({ where: { id } });

    if (!board) {
      throw new Error("CANNOT FOUND POST!");
    }

    board.viewCount += 1;
    await this.boardRepo.save(board);

    return new BoardResponseDto(board);
  }

  async deleteBoard(id: number): Promise<void> {
    const board = await this.boardRepo.findOne({ where: { id } });
    if (!board) throw new Error("게시글을 찾을 수 없습니다.");
    await this.boardRepo.remove(board);
  }

  async updateBoard(dto: UpdateBoardDto, id: number): Promise<Board> {
    const board = await this.boardRepo.findOne({ where: { id } });
    if (!board) throw new Error("게시글을 찾을 수 없습니다.");
    this.boardRepo.merge(board, dto);
    return await this.boardRepo.save(board);
  }

  async searchBoards(keyword: string): Promise<Board[]> {
    return await this.boardRepo.find({
      where: [
        { title: Like(`%${keyword}%`) },
        { content: Like(`%${keyword}%`) },
      ],
      order: {
        id: "DESC",
      },
    });
  }

  async getBoardStats() {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
      .toISOString()
      .split("T")[0];

    const todayViewsResult = await this.boardRepo
      .createQueryBuilder("board")
      .select("SUM(board.viewCount)", "todayViews")
      .where("DATE(board.workdate) = :today", { today })
      .getRawOne();

    const todayViews = todayViewsResult?.todayViews || 0;

    const yesterdayViewsResult = await this.boardRepo
      .createQueryBuilder("board")
      .select("SUM(board.viewCount)", "yesterdayViews")
      .where("DATE(board.workdate) = :yesterday", { yesterday })
      .getRawOne();

    const yesterdayViews = yesterdayViewsResult?.yesterdayViews || 0;

    const totalViewsResult = await this.boardRepo
      .createQueryBuilder("board")
      .select("SUM(board.viewCount)", "totalViews")
      .getRawOne();

    const totalViews = totalViewsResult?.totalViews || 0;

    const monthlyViews = await this.boardRepo
      .createQueryBuilder("board")
      .select(
        "SUBSTRING(board.workdate, 1, 7) AS month, SUM(board.viewCount) AS totalViews"
      )
      .groupBy("month")
      .orderBy("month", "DESC")
      .getRawMany();

    return {
      today: todayViews,
      yesterday: yesterdayViews,
      total: totalViews,
      monthly: monthlyViews,
    };
  }
}
