import prismaMock from "../helpers/prisma-mock";
import app from "../helpers/test-app";
import request from "supertest";

describe("Visitor Router", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/visitor/stats", () => {
    it("200 — 방문자 통계를 반환한다", async () => {
      prismaMock.visitor.count.mockResolvedValueOnce(5);
      prismaMock.visitor.count.mockResolvedValueOnce(3);
      prismaMock.visitor.count.mockResolvedValueOnce(100);
      prismaMock.$queryRaw.mockResolvedValue([
        { month: "2026-04", count: BigInt(10) },
      ]);

      const res = await request(app).get("/api/visitor/stats");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("today");
      expect(res.body.data).toHaveProperty("yesterday");
      expect(res.body.data).toHaveProperty("total");
    });
  });

  describe("POST /api/visitor", () => {
    it("201 — 방문자 기록을 생성한다 (IP는 서버에서 추출)", async () => {
      prismaMock.visitor.findFirst.mockResolvedValue(null);
      const visitor = { id: 1, ip: "::ffff:127.0.0.1", date: "2026-04-09" };
      prismaMock.visitor.create.mockResolvedValue(visitor);

      const res = await request(app).post("/api/visitor");

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it("201 — 이미 방문한 IP+날짜면 기존 레코드 반환", async () => {
      const existing = { id: 1, ip: "::ffff:127.0.0.1", date: "2026-04-09" };
      prismaMock.visitor.findFirst.mockResolvedValue(existing);

      const res = await request(app).post("/api/visitor");

      expect(res.status).toBe(201);
    });
  });
});
