import { Board } from "../entities/board.entity";
import { AppDataSource } from "../config/data-source";
import { BoardDto } from "../dto/board.dto";

export class BoardService {
  private boardRepo = AppDataSource.getRepository(Board);

  async getAllBoardList(): Promise<BoardDto[]> {
    const boardList = await this.boardRepo.find();
    return boardList.map((board) => new BoardDto(board));
  }

  async getDiaryList(): Promise<BoardDto[]> {
    const diaryList = await this.boardRepo.find({
      where: {
        category: "diary",
      },
    });
    return diaryList.map((diary) => new BoardDto(diary));
  }

  async getTilList(): Promise<BoardDto[]> {
    const tilList = await this.boardRepo.find({
      where: {
        category: "til",
      },
    });
    return tilList.map((til) => new BoardDto(til));
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
