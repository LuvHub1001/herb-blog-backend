import prismaMock from "../helpers/prisma-mock";

jest.mock("../../src/config/prisma", () => ({
  __esModule: true,
  default: prismaMock,
}));

import { BoardService } from "../../src/service/board.service";

describe("BoardService", () => {
  let service: BoardService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new BoardService();
  });

  describe("getAllBoardList", () => {
    it("페이지네이션된 게시글 목록을 반환한다", async () => {
      const boards = [{ id: 1, title: "테스트", writer: "admin" }];
      prismaMock.board.findMany.mockResolvedValue(boards);
      prismaMock.board.count.mockResolvedValue(1);

      const result = await service.getAllBoardList(1, 8);

      expect(result.totalCount).toBe(1);
      expect(result.res).toEqual(boards);
      expect(result.startIndex).toBe(1);
    });

    it("2페이지의 skip 계산이 올바르다", async () => {
      prismaMock.board.findMany.mockResolvedValue([]);
      prismaMock.board.count.mockResolvedValue(20);

      await service.getAllBoardList(2, 8);

      expect(prismaMock.board.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 8, take: 8 })
      );
    });
  });

  describe("getBoardListByCategory", () => {
    it("카테고리로 필터링된 목록을 반환한다", async () => {
      prismaMock.board.findMany.mockResolvedValue([]);
      prismaMock.board.count.mockResolvedValue(0);

      await service.getBoardListByCategory("til", 1, 8);

      expect(prismaMock.board.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { category: "til" } })
      );
    });
  });

  describe("getRecentMainList", () => {
    it("최신 3개 게시글을 반환한다", async () => {
      const boards = [
        { id: 2, writer: "a", title: "b", subTitle: "s", content: "c", subContent: "", thumbnail: "", category: "til", viewCount: 0, workdate: new Date() },
      ];
      prismaMock.board.findMany.mockResolvedValue(boards);

      const result = await service.getRecentMainList();

      expect(prismaMock.board.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 3, orderBy: { id: "desc" } })
      );
      expect(result).toHaveLength(1);
    });
  });

  describe("createBoard", () => {
    it("새 게시글을 생성하고 반환한다", async () => {
      const dto = { writer: "admin", title: "제목", subTitle: "부제", content: "내용", subContent: "", thumbnail: "", category: "til", viewCount: 0, workdate: new Date() };
      const created = { id: 1, ...dto };
      prismaMock.board.create.mockResolvedValue(created);

      const result = await service.createBoard(dto);

      expect(prismaMock.board.create).toHaveBeenCalledWith({ data: dto });
      expect(result.id).toBe(1);
    });
  });

  describe("getBoardDetail", () => {
    it("게시글 상세를 반환하고 조회수를 증가시킨다", async () => {
      const board = { id: 1, writer: "admin", title: "테스트", subTitle: "s", content: "c", subContent: "", thumbnail: "", category: "til", viewCount: 6, workdate: new Date() };
      prismaMock.board.findUnique.mockResolvedValue(board);

      const result = await service.getBoardDetail(1);

      expect(prismaMock.board.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).not.toBeNull();
    });

    it("존재하지 않는 게시글은 에러를 던진다", async () => {
      prismaMock.board.findUnique.mockResolvedValue(null);

      await expect(service.getBoardDetail(999)).rejects.toThrow("게시글을 찾을 수 없습니다.");
    });
  });

  describe("deleteBoard", () => {
    it("본인 게시글을 삭제한다", async () => {
      prismaMock.board.findUnique.mockResolvedValue({ id: 1, writer: "admin" });

      await service.deleteBoard(1, "admin");

      expect(prismaMock.board.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it("다른 사람의 게시글은 삭제할 수 없다", async () => {
      prismaMock.board.findUnique.mockResolvedValue({ id: 1, writer: "admin" });

      await expect(service.deleteBoard(1, "hacker")).rejects.toThrow("권한이 없습니다.");
    });

    it("존재하지 않는 게시글은 에러를 던진다", async () => {
      prismaMock.board.findUnique.mockResolvedValue(null);

      await expect(service.deleteBoard(999, "admin")).rejects.toThrow("게시글을 찾을 수 없습니다.");
    });
  });

  describe("updateBoard", () => {
    it("본인 게시글을 수정한다", async () => {
      prismaMock.board.findUnique.mockResolvedValue({ id: 1, writer: "admin", title: "기존" });
      prismaMock.board.update.mockResolvedValue({ id: 1, writer: "admin", title: "수정됨" });

      const result = await service.updateBoard({ title: "수정됨" }, 1, "admin");

      expect(result.title).toBe("수정됨");
    });

    it("다른 사람의 게시글은 수정할 수 없다", async () => {
      prismaMock.board.findUnique.mockResolvedValue({ id: 1, writer: "admin" });

      await expect(service.updateBoard({ title: "해킹" }, 1, "hacker")).rejects.toThrow("권한이 없습니다.");
    });
  });

  describe("searchBoards", () => {
    it("키워드로 게시글을 검색한다 (페이지네이션 포함)", async () => {
      prismaMock.board.findMany.mockResolvedValue([]);
      prismaMock.board.count.mockResolvedValue(0);

      const result = await service.searchBoards("테스트", 1, 20);

      expect(prismaMock.board.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 20, skip: 0, orderBy: { id: "desc" } })
      );
      expect(result).toHaveProperty("totalCount", 0);
    });
  });
});
