import prismaMock from "../helpers/prisma-mock";

jest.mock("../../src/config/prisma", () => ({
  __esModule: true,
  default: prismaMock,
}));

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mock-jwt-token"),
}));

import { loginUser } from "../../src/service/auth.service";
import bcrypt from "bcrypt";

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("loginUser", () => {
    const mockUser = {
      id: 1,
      userId: "admin",
      username: "관리자",
      nickname: "herb",
      email: "admin@test.com",
      password: "$2b$10$hashedpassword",
      role: "admin",
    };

    it("올바른 자격 증명으로 토큰을 반환한다", async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const token = await loginUser("admin", "password123");

      expect(token).toBe("mock-jwt-token");
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { userId: "admin" } });
    });

    it("존재하지 않는 사용자는 에러를 던진다", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(loginUser("unknown", "password")).rejects.toThrow("존재하지 않는 사용자입니다.");
    });

    it("비밀번호 불일치 시 에러를 던진다", async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(loginUser("admin", "wrongpassword")).rejects.toThrow("비밀번호가 일치하지 않습니다.");
    });
  });
});
