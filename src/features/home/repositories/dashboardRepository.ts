import { SQLiteDatabase } from "expo-sqlite";

export interface RecentSale {
  id: number;
  total: number;
  desconto: number;
  status: string;
  data_venda: string;
}

export interface DashboardSummary {
  todaySalesTotal: number;
  todaySalesCount: number;
  totalProducts: number;
}

export class DashboardRepository {
  constructor(private readonly db: SQLiteDatabase) { }

  async getTodaySalesTotal(): Promise<number> {
    const result = await this.db.getFirstAsync<{
      total: number;
    }>(`
      SELECT COALESCE(SUM(total), 0) AS total
      FROM vendas
      WHERE status = 'concluida'
        AND date(data_venda) = date('now', 'localtime')
    `);

    return result?.total ?? 0;
  }

  async getTodaySalesCount(): Promise<number> {
    const result = await this.db.getFirstAsync<{
      total: number;
    }>(`
      SELECT COUNT(*) AS total
      FROM vendas
      WHERE status = 'concluida'
        AND date(data_venda) = date('now', 'localtime')
    `);

    return result?.total ?? 0;
  }

  async getTotalProducts(): Promise<number> {
    const result = await this.db.getFirstAsync<{
      total: number;
    }>(`
      SELECT COUNT(*) AS total
      FROM produtos
      WHERE ativo = 1
    `);

    return result?.total ?? 0;
  }

  async getRecentSales(limit = 5): Promise<RecentSale[]> {
    return this.db.getAllAsync<RecentSale>(
      `
        SELECT
          id,
          total,
          desconto,
          status,
          data_venda
        FROM vendas
        WHERE status = 'concluida'
        ORDER BY datetime(data_venda) DESC
        LIMIT ?
      `,
      [limit],
    );
  }

  async getSummary(): Promise<DashboardSummary> {
    const [todaySalesTotal, todaySalesCount, totalProducts] = await Promise.all(
      [
        this.getTodaySalesTotal(),
        this.getTodaySalesCount(),
        this.getTotalProducts(),
      ],
    );

    return {
      todaySalesTotal,
      todaySalesCount,
      totalProducts,
    };
  }
}
