import prismaMock from "../helpers/prisma-mock";
import app from "../helpers/test-app";
import request from "supertest";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

const TEST_SECRET = "test-secret";
process.env.JWT_SECRET = TEST_SECRET;

describe("Auth Router", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/login", () => {
    it("200 — 올바른 자격 증명으로 토큰 반환", async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        userId: "admin",
        username: "관리자",
        role: "admin",
        email: "admin@test.com",
        password: "$2b$10$hashed",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const res = await request(app)
        .post("/api/auth/login")
        .send({ id: "admin", password: "password123" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it("401 — 잘못된 비밀번호는 일반적 에러 메시지 반환", async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        userId: "admin",
        password: "$2b$10$hashed",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const res = await request(app)
        .post("/api/auth/login")
        .send({ id: "admin", password: "wrong" });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("아이디 또는 비밀번호가 올바르지 않습니다.");
      expect(res.body.error).not.toContain("일치하지");
    });

    it("401 — 존재하지 않는 사용자도 일반적 에러 메시지 반환", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/auth/login")
        .send({ id: "unknown", password: "password" });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("아이디 또는 비밀번호가 올바르지 않습니다.");
    });
  });

  describe("GET /api/auth/verify", () => {
    it("200 — 유효한 토큰으로 사용자 정보 반환", async () => {
      const token = jwt.sign(
        { userId: "admin", role: "admin", email: "admin@test.com" },
        TEST_SECRET,
        { expiresIn: "1h" }
      );

      const res = await request(app)
        .get("/api/auth/verify")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("401 — 토큰 없이 요청하면 거부", async () => {
      const res = await request(app).get("/api/auth/verify");
      expect(res.status).toBe(401);
    });

    it("403 — 만료된 토큰은 거부", async () => {
      const token = jwt.sign({ userId: "admin" }, TEST_SECRET, { expiresIn: "0s" });
      await new Promise((resolve) => setTimeout(resolve, 100));

      const res = await request(app)
        .get("/api/auth/verify")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(403);
    });
  });
});
