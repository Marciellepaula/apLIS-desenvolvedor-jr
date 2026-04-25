import { getPool } from "./pool.js";

export async function migrate() {
  const pool = getPool();

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS pacientes (
      id              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
      nome            VARCHAR(120)  NOT NULL,
      data_nascimento DATE          NULL,
      carteirinha     VARCHAR(40)   NOT NULL,
      cpf             CHAR(11)      NOT NULL,
      created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at      TIMESTAMP     NULL     DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uk_pacientes_cpf (cpf),
      UNIQUE KEY uk_pacientes_carteirinha (carteirinha)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  console.log("[migrate] Tabela pacientes OK.");
}
