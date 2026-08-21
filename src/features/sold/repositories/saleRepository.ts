import { SQLiteDatabase } from "expo-sqlite";
import { CreateSaleDTO, RecentSale, SaleResult } from "../types/sold";

export class SaleRepository {
  constructor(private db: SQLiteDatabase) {}

  async createSale(data: CreateSaleDTO): Promise<SaleResult> {
    if (data.items.length === 0) {
      throw new Error("A venda precisa ter pelo menos um produto.");
    }

    const desconto = data.desconto ?? 0;

    if (desconto < 0) {
      throw new Error("O desconto não pode ser negativo.");
    }

    let saleId = 0;
    let total = 0;

    await this.db.withTransactionAsync(async () => {
      /*
       * ==========================================
       * 1. VALIDAR PRODUTOS E ESTOQUE
       * ==========================================
       */

      const products = [];

      for (const item of data.items) {
        if (item.quantity <= 0) {
          throw new Error("A quantidade do produto deve ser maior que zero.");
        }

        const product = await this.db.getFirstAsync<{
          id: number;
          nome: string;
          preco: number;
          estoque: number;
          ativo: number;
        }>(
          `
              SELECT
                id,
                nome,
                preco,
                estoque,
                ativo
              FROM produtos
              WHERE id = ?
              LIMIT 1
            `,
          [item.productId],
        );

        if (!product) {
          throw new Error(`Produto ${item.productId} não encontrado.`);
        }

        if (product.ativo !== 1) {
          throw new Error(`O produto "${product.nome}" está inativo.`);
        }

        if (product.estoque < item.quantity) {
          throw new Error(
            `Estoque insuficiente para "${product.nome}". ` +
              `Disponível: ${product.estoque}.`,
          );
        }

        products.push({
          ...product,
          quantity: item.quantity,
        });

        total += product.preco * item.quantity;
      }

      /*
       * ==========================================
       * 2. APLICAR DESCONTO
       * ==========================================
       */

      total = Math.max(total - desconto, 0);

      /*
       * ==========================================
       * 3. CRIAR VENDA
       * ==========================================
       */

      const saleResult = await this.db.runAsync(
        `
            INSERT INTO vendas (
              total,
              desconto,
              status
            )
            VALUES (?, ?, ?)
          `,
        [total, desconto, "concluida"],
      );

      saleId = saleResult.lastInsertRowId;

      /*
       * ==========================================
       * 4. CRIAR ITENS DA VENDA
       * ==========================================
       */

      for (const product of products) {
        const subtotal = product.preco * product.quantity;

        await this.db.runAsync(
          `
            INSERT INTO itens_venda (
              venda_id,
              produto_id,
              quantidade,
              preco_unitario,
              subtotal
            )
            VALUES (?, ?, ?, ?, ?)
          `,
          [saleId, product.id, product.quantity, product.preco, subtotal],
        );

        /*
         * ========================================
         * 5. BAIXAR ESTOQUE
         * ========================================
         */

        const updateResult = await this.db.runAsync(
          `
              UPDATE produtos
              SET estoque = estoque - ?
              WHERE id = ?
                AND estoque >= ?
            `,
          [product.quantity, product.id, product.quantity],
        );

        if (updateResult.changes !== 1) {
          throw new Error(
            `Não foi possível atualizar o estoque de "${product.nome}".`,
          );
        }

        /*
         * ========================================
         * 6. REGISTRAR MOVIMENTO
         * ========================================
         */

        await this.db.runAsync(
          `
            INSERT INTO movimentos_estoque (
              produto_id,
              tipo,
              quantidade,
              motivo
            )
            VALUES (?, ?, ?, ?)
          `,
          [product.id, "saida", product.quantity, `Venda #${saleId}`],
        );
      }

      /*
       * ==========================================
       * 7. REGISTRAR PAGAMENTO
       * ==========================================
       */

      await this.db.runAsync(
        `
          INSERT INTO pagamentos (
            venda_id,
            metodo,
            valor,
            status
          )
          VALUES (?, ?, ?, ?)
        `,
        [saleId, data.pagamento.metodo, data.pagamento.valor, "pago"],
      );
    });

    return {
      saleId,
      total,
    };
  }

  async getTodayTotal(): Promise<number> {
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

  async getRecentSales(limit = 10): Promise<RecentSale[]> {
    return this.db.getAllAsync<RecentSale>(
      `
      SELECT
        id,
        total,
        desconto,
        status,
        data_venda
      FROM vendas
      ORDER BY datetime(data_venda) DESC
      LIMIT ?
    `,
      [limit],
    );
  }
}
