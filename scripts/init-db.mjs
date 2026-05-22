// One-shot DB init + admin seed.
// Run: node --env-file=.env.local scripts/init-db.mjs
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const {
  DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT = 3306,
  ADMIN_EMAIL = "admin@skylonze.com",
  ADMIN_PASSWORD = "Skylonze@Admin777",
  ADMIN_NAME = "SKYLONZE Admin",
} = process.env;

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    handle VARCHAR(60) NOT NULL UNIQUE,
    email VARCHAR(190) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user','admin') NOT NULL DEFAULT 'user',
    sky_balance BIGINT NOT NULL DEFAULT 0,
    status ENUM('active','suspended') NOT NULL DEFAULT 'active',
    avatar_seed VARCHAR(60) DEFAULT NULL,
    email_verified TINYINT NOT NULL DEFAULT 0,
    bonus_granted TINYINT NOT NULL DEFAULT 0,
    verify_token_hash VARCHAR(64) DEFAULT NULL,
    verify_expires DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  `CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('credit','debit') NOT NULL,
    amount BIGINT NOT NULL,
    balance_after BIGINT NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    CONSTRAINT fk_tx_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  `CREATE TABLE IF NOT EXISTS predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    market_id VARCHAR(64) NOT NULL,
    market_title VARCHAR(190) NOT NULL,
    category VARCHAR(40) NOT NULL,
    side ENUM('YES','NO') NOT NULL,
    stake BIGINT NOT NULL,
    entry_prob INT NOT NULL,
    potential_payout BIGINT NOT NULL,
    status ENUM('open','won','lost') NOT NULL DEFAULT 'open',
    settled_at TIMESTAMP NULL DEFAULT NULL,
    paid_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_pred_user (user_id),
    INDEX idx_pred_market (market_id),
    INDEX idx_pred_status (status),
    CONSTRAINT fk_pred_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  `CREATE TABLE IF NOT EXISTS market_resolutions (
    market_id VARCHAR(64) PRIMARY KEY,
    outcome ENUM('YES','NO') NOT NULL,
    resolved_by INT NULL,
    won_count INT NOT NULL DEFAULT 0,
    lost_count INT NOT NULL DEFAULT 0,
    paid_out BIGINT NOT NULL DEFAULT 0,
    distributed TINYINT NOT NULL DEFAULT 0,
    distributed_at TIMESTAMP NULL DEFAULT NULL,
    resolved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
];

// Idempotent column adds (MySQL has no ADD COLUMN IF NOT EXISTS).
const COLUMN_ADDS = [
  { table: "predictions", column: "settled_at", ddl: "ALTER TABLE predictions ADD COLUMN settled_at TIMESTAMP NULL DEFAULT NULL" },
  { table: "predictions", column: "paid_at", ddl: "ALTER TABLE predictions ADD COLUMN paid_at TIMESTAMP NULL DEFAULT NULL" },
  { table: "market_resolutions", column: "distributed", ddl: "ALTER TABLE market_resolutions ADD COLUMN distributed TINYINT NOT NULL DEFAULT 0" },
  { table: "market_resolutions", column: "distributed_at", ddl: "ALTER TABLE market_resolutions ADD COLUMN distributed_at TIMESTAMP NULL DEFAULT NULL" },
  { table: "users", column: "email_verified", ddl: "ALTER TABLE users ADD COLUMN email_verified TINYINT NOT NULL DEFAULT 0" },
  { table: "users", column: "bonus_granted", ddl: "ALTER TABLE users ADD COLUMN bonus_granted TINYINT NOT NULL DEFAULT 0" },
  { table: "users", column: "verify_token_hash", ddl: "ALTER TABLE users ADD COLUMN verify_token_hash VARCHAR(64) DEFAULT NULL" },
  { table: "users", column: "verify_expires", ddl: "ALTER TABLE users ADD COLUMN verify_expires DATETIME DEFAULT NULL" },
];

const c = await mysql.createConnection({
  host: DB_HOST, user: DB_USER, password: DB_PASSWORD,
  database: DB_NAME, port: Number(DB_PORT), multipleStatements: true,
});

console.log("Connected. Creating tables…");
for (const s of SCHEMA) await c.query(s);
for (const a of COLUMN_ADDS) {
  const [col] = await c.query(
    "SELECT COUNT(*) n FROM information_schema.columns WHERE table_schema=? AND table_name=? AND column_name=?",
    [DB_NAME, a.table, a.column],
  );
  if (col[0].n === 0) { await c.query(a.ddl); console.log(`Added column ${a.table}.${a.column}`); }
}

// Seed admin
const [rows] = await c.query("SELECT id FROM users WHERE email=?", [ADMIN_EMAIL]);
const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
if (rows.length === 0) {
  await c.query(
    "INSERT INTO users (name, handle, email, password_hash, role, sky_balance, avatar_seed, email_verified, bonus_granted) VALUES (?,?,?,?,?,?,?,1,1)",
    [ADMIN_NAME, "admin", ADMIN_EMAIL, hash, "admin", 0, "admin"],
  );
  console.log("Admin seeded:", ADMIN_EMAIL);
} else {
  await c.query("UPDATE users SET password_hash=?, role='admin', name=?, email_verified=1, bonus_granted=1 WHERE email=?", [hash, ADMIN_NAME, ADMIN_EMAIL]);
  console.log("Admin updated:", ADMIN_EMAIL);
}

await c.end();
console.log("Done.");
