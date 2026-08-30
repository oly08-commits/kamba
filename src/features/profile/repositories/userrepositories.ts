import { SQLiteDatabase } from "expo-sqlite";
import { User } from "../types/user";

export class UserRepository {
  constructor(private readonly db: SQLiteDatabase) { }

  async create(data: Omit<User, "id">) {
    if (!data.nome.trim()) {
      throw new Error("O nome é obrigatório.");
    }

    try {
      const result = await this.db.runAsync(`
        INSERT INTO  usuarios (
        nome,
        senha,
        telefone
        ) VALUES (?, ?, ?)
        `, [
        data.nome,
        data.senha,
        data.telefone ?? null
      ])

      return result.lastInsertRowId
    } catch (error) {
      console.log(error);
    }
  }

  async getFristUser(): Promise<User | null> {
    const result = await this.db.getFirstAsync<User>(`
        SELECT *
        FROM usuarios
        WHERE id = ?
        LIMIT 1          
        `, [1])
    return result
  }

  async getAllUser(): Promise<User[] | null> {
    const result = await this.db.getAllAsync<User>(`
        SELECT * FROM produtos         
        `)
    return result
  }
}
