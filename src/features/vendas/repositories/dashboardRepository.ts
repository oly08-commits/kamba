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

export class VendasRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  async getSales(): Promise<RecentSale[]> {
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
   
      `,
    );
  }
}
