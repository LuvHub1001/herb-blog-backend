import { Visitor } from "../entities/visitor.entity";
import { AppDataSource } from "../config/data-source";

export class VisitorService {
  private visitorRepo = AppDataSource.getRepository(Visitor);

  async getAllVisitors(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [visitors, totalCount] = await this.visitorRepo.findAndCount({
      skip,
      take: limit,
      order: { id: "DESC" },
    });

    const startIndex = skip + 1;
    const endIndex = Math.min(skip + limit, totalCount);

    return {
      res: visitors,
      totalCount,
      startIndex,
      endIndex,
    };
  }

  async getVisitorStats(): Promise<{
    today: number;
    yesterday: number;
    total: number;
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

    return {
      today: todayCount,
      yesterday: yesterdayCount,
      total: totalCount,
    };
  }

  async createVisitor(ip: string): Promise<Visitor> {
    const date = new Date().toISOString().split("T")[0];
    const existingVisitor = await this.visitorRepo.findOne({
      where: { ip, date },
    });

    if (existingVisitor) {
      throw new Error("해당 IP는 오늘 이미 방문했습니다.");
    }

    const visitor = this.visitorRepo.create({ ip, date });
    return await this.visitorRepo.save(visitor);
  }
}
