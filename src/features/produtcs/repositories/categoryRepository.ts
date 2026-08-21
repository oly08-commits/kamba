import { SQLiteDatabase } from "expo-sqlite";

export interface Category {
  id: number;
  nome: string;
  descricao: string | null;
  ativo: number;
}

export class CategoryRepository {
  constructor(private db: SQLiteDatabase) {}

  async findAll(): Promise<Category[]> {
    return this.db.getAllAsync<Category>(
      `
        SELECT *
        FROM categorias
        WHERE ativo = 1
        ORDER BY nome ASC
      `,
    );
  }

  async create(nome: string, descricao?: string): Promise<number> {
    const result = await this.db.runAsync(
      `
        INSERT INTO categorias (nome, descricao)
        VALUES (?, ?)
      `,
      [nome, descricao ?? null],
    );

    return result.lastInsertRowId;
  }
}
