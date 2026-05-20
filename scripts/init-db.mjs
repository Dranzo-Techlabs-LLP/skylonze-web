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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_pred_user (user_id),
    INDEX idx_pred_market (market_id),
    CONSTRAINT fk_pred_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
];

const c = await mysql.createConnection({
  host: DB_HOST, user: DB_USER, password: DB_PASSWORD,
  database: DB_NAME, port: Number(DB_PORT), multipleStatements: true,
});

console.log("Connected. Creating tables…");
for (const s of SCHEMA) await c.query(s);

// Seed admin
const [rows] = await c.query("SELECT id FROM users WHERE email=?", [ADMIN_EMAIL]);
const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
if (rows.length === 0) {
  await c.query(
    "INSERT INTO users (name, handle, email, password_hash, role, sky_balance, avatar_seed) VALUES (?,?,?,?,?,?,?)",
    [ADMIN_NAME, "admin", ADMIN_EMAIL, hash, "admin", 0, "admin"],
  );
  console.log("Admin seeded:", ADMIN_EMAIL);
} else {
  await c.query("UPDATE users SET password_hash=?, role='admin', name=? WHERE email=?", [hash, ADMIN_NAME, ADMIN_EMAIL]);
  console.log("Admin updated:", ADMIN_EMAIL);
}

await c.end();
console.log("Done.");
