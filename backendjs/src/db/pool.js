import mysql from "mysql2/promise";

let pool;

export function getPool() {
  if (pool) return pool;

  pool = mysql.createPool({
    host: process.env.DB_HOST || "mysql",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "aplis",
    password: process.env.DB_PASSWORD || "aplispass",
    database: process.env.DB_NAME || "aplis",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool;
}

