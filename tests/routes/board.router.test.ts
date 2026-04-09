import prismaMock from "../helpers/prisma-mock";
import app from "../helpers/test-app";
import request from "supertest";
import jwt from "jsonwebtoken";

const TEST_SECRET = "test-secret";
process.env.JWT_SECRET = TEST_SECRET;

function generateToken(username = "admin") {
  return jwt.sign({ userId: "1", username, role: "admin", email: "admin@test.com" }, TEST_SECRET, { expiresIn: "1h" });
}

describe("Board Router", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/boards/main-recent", () => {
    it("200 — 최신 게시글 목록을 반환한다", async () => {
      prismaMock.board.findMany.mockResolvedValue([
        { id: 1, writer: "admin", title: "테스트", subTitle: "부제", content: "내용", subContent: "", thumbnail: "", category: "til", viewCount: 0, workdate: new Date("2026-04-01") },
      ]);

      const res = await request(app).get("/api/boards/main-recent");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });
  });

  describe("GET /api/boards/detail/:id", () => {
    it("200 — 게시글 상세를 반환한다", async () => {
      const board = { id: 1, writer: "admin", title: "테스트", subTitle: "부제", content: "내용", subContent: "", thumbnail: "", category: "til", viewCount: 5, workdate: new Date("2026-04-01") };
      prismaMock.board.findUnique.mockResolvedValue(board);
      prismaMock.board.update.mockResolvedValue({ ...board, viewCount: 6 });

      const res = await request(app).get("/api/boards/detail/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("400 — 잘못된 ID를 거부한다", async () => {
      const res = await request(app).get("/api/boards/detail/abc");
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/boards/search", () => {
    it("200 — 키워드로 검색한다", async () => {
      prismaMock.board.findMany.mockResolvedValue([]);

      const res = await request(app).get("/api/boards/search?keyword=테스트");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("400 — 키워드 없이 검색하면 에러", async () => {
      const res = await request(app).get("/api/boards/search");
      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/boards", () => {
    it("401 — 토큰 없이 생성 시도하면 거부", async () => {
      const res = await request(app).post("/api/boards").send({ title: "test" });
      expect(res.status).toBe(401);
    });

    it("201 — 인증된 사용자는 게시글을 생성할 수 있다", async () => {
      const token = generateToken("admin");
      const board = { id: 1, writer: "admin", title: "제목", subTitle: "부제", content: "내용", subContent: "", thumbnail: "", category: "til", viewCount: 0, workdate: new Date() };
      prismaMock.board.create.mockResolvedValue(board);

      const res = await request(app)
        .post("/api/boards")
        .set("Authorization", `Bearer ${token}`)
        .send({
          writer: "should-be-overridden",
          title: "제목",
          subTitle: "부제",
          content: "내용",
          category: "til",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(prismaMock.board.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ writer: "admin" }),
      });
    });
  });

  describe("DELETE /api/boards/:id", () => {
    it("401 — 토큰 없이 삭제 시도하면 거부", async () => {
      const res = await request(app).delete("/api/boards/1");
      expect(res.status).toBe(401);
    });

    it("200 — 본인 게시글 삭제 성공", async () => {
      const token = generateToken("admin");
      prismaMock.board.findUnique.mockResolvedValue({ id: 1, writer: "admin" });
      prismaMock.board.delete.mockResolvedValue({});

      const res = await request(app)
        .delete("/api/boards/1")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("PATCH /api/boards/:id", () => {
    it("200 — 본인 게시글 수정 성공", async () => {
      const token = generateToken("admin");
      prismaMock.board.findUnique.mockResolvedValue({ id: 1, writer: "admin", title: "기존" });
      prismaMock.board.update.mockResolvedValue({ id: 1, writer: "admin", title: "수정됨" });

      const res = await request(app)
        .patch("/api/boards/1")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "수정됨" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
