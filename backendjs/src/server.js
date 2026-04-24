import express from "express";
import mysql from "mysql2/promise";

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT || 3000);

async function getPool() {
  return mysql.createPool({
    host: process.env.DB_HOST || "mysql",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "aplis",
    password: process.env.DB_PASSWORD || "aplispass",
    database: process.env.DB_NAME || "aplis",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

const poolPromise = getPool();

app.get("/health", (_req, res) => res.json({ ok: true }));

app.get("/api/v1/pacientes", async (_req, res) => {
  try {
    const pool = await poolPromise;
    const [rows] = await pool.query(
      "SELECT id, nome, DATE_FORMAT(data_nascimento, '%Y-%m-%d') AS dataNascimento, carteirinha, cpf FROM pacientes ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar pacientes" });
  }
});

app.post("/api/v1/pacientes", async (req, res) => {
  const { nome, dataNascimento, carteirinha, cpf } = req.body || {};
  if (!nome || !carteirinha || !cpf) {
    return res.status(400).json({ error: "Campos obrigatórios: nome, carteirinha, cpf" });
  }

  try {
    const pool = await poolPromise;
    await pool.execute(
      "INSERT INTO pacientes (nome, data_nascimento, carteirinha, cpf) VALUES (?, ?, ?, ?)",
      [nome, dataNascimento || null, carteirinha, cpf]
    );
    res.json({ message: "Paciente criado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar paciente" });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`backend-node listening on :${PORT}`);
});
