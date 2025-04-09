import { Board } from "../entities/board.entity";
import { AppDataSource } from "../config/data-source";
import { BoardDto } from "../dto/board.dto";

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

  async getRecentMainList(): Promise<BoardDto[]> {
    const recentMainList = await this.boardRepo.find({
      take: 4,
      order: {
        id: "DESC",
      },
    });
    return recentMainList.map((board) => new BoardDto(board));
  }

  async getTilMainList(): Promise<BoardDto[]> {
    const tilMainList = await this.boardRepo.find({
      take: 4,
      where: {
        category: "til",
      },
      order: {
        id: "DESC",
      },
    });
    return tilMainList.map((til) => new BoardDto(til));
  }

  async getDiaryMainList(): Promise<BoardDto[]> {
    const diaryMainList = await this.boardRepo.find({
      take: 4,
      where: {
        category: "diary",
      },
      order: {
        id: "DESC",
      },
    });
    return diaryMainList.map((diary) => new BoardDto(diary));
  }
}
