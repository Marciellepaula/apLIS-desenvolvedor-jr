import { getPool } from "../db/pool.js";

export class PacienteRepository {
  constructor() {
    this.pool = getPool();
  }

  async list() {
    const [rows] = await this.pool.query(
      "SELECT id, nome, DATE_FORMAT(data_nascimento, '%Y-%m-%d') AS dataNascimento, carteirinha, cpf FROM pacientes ORDER BY id DESC"
    );
    return rows;
  }

  async findById(id) {
    const [rows] = await this.pool.execute(
      "SELECT id, nome, DATE_FORMAT(data_nascimento, '%Y-%m-%d') AS dataNascimento, carteirinha, cpf FROM pacientes WHERE id = ?",
      [id]
    );
    return rows[0] ?? null;
  }

  async create({ nome, dataNascimento, carteirinha, cpf }) {
    const [result] = await this.pool.execute(
      "INSERT INTO pacientes (nome, data_nascimento, carteirinha, cpf) VALUES (?, ?, ?, ?)",
      [nome, dataNascimento ?? null, carteirinha, cpf]
    );
    return Number(result.insertId);
  }

  async update(id, { nome, dataNascimento, carteirinha, cpf }) {
    const [result] = await this.pool.execute(
      "UPDATE pacientes SET nome = ?, data_nascimento = ?, carteirinha = ?, cpf = ? WHERE id = ?",
      [nome, dataNascimento ?? null, carteirinha, cpf, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id) {
    const [result] = await this.pool.execute("DELETE FROM pacientes WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }
}

