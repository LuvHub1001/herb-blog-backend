import { Visitor } from "../entities/visitor.entity";
import { AppDataSource } from "../config/data-source";

export class VisitorService {
  private visitorRepo = AppDataSource.getRepository(Visitor);

  async getVisitorStats(): Promise<{
    today: number;
    yesterday: number;
    total: number;
    monthlyStats: { month: string; count: number }[];
  }> {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
      .toISOString()
      .split("T")[0];

    const todayCount = await this.visitorRepo.count({ where: { date: today } });
    const yesterdayCount = await this.visitorRepo.count({
      where: { date: yesterday },
    });
    const totalCount = await this.visitorRepo.count();

    const monthlyStats = await this.visitorRepo
      .createQueryBuilder("visitor")
      .select("SUBSTRING(visitor.date, 1, 7) AS month")
      .addSelect("COUNT(visitor.id)", "count")
      .groupBy("month")
      .orderBy("month", "ASC")
      .getRawMany();

    return {
      today: todayCount,
      yesterday: yesterdayCount,
      total: totalCount,
      monthlyStats: monthlyStats.map((stat) => ({
        month: stat.month,
        count: parseInt(stat.count),
      })),
    };
  }

  async createVisitor(ip: string): Promise<Visitor> {
    const date = new Date().toISOString().split("T")[0];

    const existingVisitor = await this.visitorRepo.findOne({
      where: { date },
    });

    if (existingVisitor) {
      return existingVisitor;
    }

    const visitor = this.visitorRepo.create({ date });
    const savedVisitor = await this.visitorRepo.save(visitor);

    return savedVisitor;
  }
}
