import { Board } from "../entities/board.entity";
import { AppDataSource } from "../config/data-source";
import { BoardDto } from "../dto/board.dto";

export class BoardService {
  private boardRepo = AppDataSource.getRepository(Board);

  async getAllBoards(): Promise<BoardDto[]> {
    const boardList = await this.boardRepo.find();
    return boardList.map((board) => new BoardDto(board));
  }
}
