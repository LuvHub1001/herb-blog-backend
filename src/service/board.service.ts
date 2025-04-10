import { Board } from "../entities/board.entity";
import { AppDataSource } from "../config/data-source";
import { BoardResponseDto } from "../dto/boards/board.response.dto";
import { CreateBoardDto } from "../dto/boards/board.create.dto";

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
      take: 4,
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
}
