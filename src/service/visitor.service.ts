import prisma from "../config/prisma";

export class VisitorService {
  async getVisitorStats() {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    const [todayCount, yesterdayCount, totalCount, monthlyStats] = await Promise.all([
      prisma.visitor.count({ where: { date: today } }),
      prisma.visitor.count({ where: { date: yesterday } }),
      prisma.visitor.count(),
      prisma.$queryRaw<{ month: string; count: bigint }[]>`
        SELECT SUBSTRING(date, 1, 7) as month, COUNT(*)::bigint as count
        FROM visitor GROUP BY month ORDER BY month ASC`,
    ]);

    return {
      today: todayCount,
      yesterday: yesterdayCount,
      total: totalCount,
      monthlyStats: monthlyStats.map((stat) => ({
        month: stat.month,
        count: Number(stat.count),
      })),
    };
  }

  async createVisitor(ip: string) {
    const date = new Date().toISOString().split("T")[0];

    // 같은 날 + 같은 IP 방문자만 중복 체크 (기존: date만 체크하여 하루 1명만 기록됨)
    const existing = await prisma.visitor.findFirst({ where: { date, ip } });
    if (existing) return existing;

    return await prisma.visitor.create({ data: { ip, date } });
  }
}
