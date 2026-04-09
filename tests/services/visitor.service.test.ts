import prismaMock from "../helpers/prisma-mock";

jest.mock("../../src/config/prisma", () => ({
  __esModule: true,
  default: prismaMock,
}));

import { VisitorService } from "../../src/service/visitor.service";

describe("VisitorService", () => {
  let service: VisitorService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new VisitorService();
  });

  describe("getVisitorStats", () => {
    it("방문자 통계를 반환한다", async () => {
      prismaMock.visitor.count.mockResolvedValueOnce(5);   // today
      prismaMock.visitor.count.mockResolvedValueOnce(3);   // yesterday
      prismaMock.visitor.count.mockResolvedValueOnce(100); // total
      prismaMock.$queryRaw.mockResolvedValue([
        { month: "2026-04", count: BigInt(10) },
        { month: "2026-03", count: BigInt(20) },
      ]);

      const result = await service.getVisitorStats();

      expect(result.today).toBe(5);
      expect(result.yesterday).toBe(3);
      expect(result.total).toBe(100);
      expect(result.monthlyStats).toHaveLength(2);
      expect(result.monthlyStats[0].count).toBe(10);
    });
  });

  describe("createVisitor", () => {
    it("오늘 첫 방문이면 새 레코드를 생성한다", async () => {
      prismaMock.visitor.findFirst.mockResolvedValue(null);
      const visitor = { id: 1, ip: "127.0.0.1", date: "2026-04-09" };
      prismaMock.visitor.create.mockResolvedValue(visitor);

      const result = await service.createVisitor("127.0.0.1");

      expect(prismaMock.visitor.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ ip: "127.0.0.1" }),
      });
      expect(result.ip).toBe("127.0.0.1");
    });

    it("이미 방문한 날짜면 기존 레코드를 반환한다", async () => {
      const existing = { id: 1, ip: "127.0.0.1", date: "2026-04-09" };
      prismaMock.visitor.findFirst.mockResolvedValue(existing);

      const result = await service.createVisitor("127.0.0.1");

      expect(prismaMock.visitor.create).not.toHaveBeenCalled();
      expect(result).toEqual(existing);
    });
  });
});
