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

  `CREATE TABLE IF NOT EXISTS markets (
    id VARCHAR(64) PRIMARY KEY,
    category VARCHAR(40) NOT NULL,
    title VARCHAR(190) NOT NULL,
    question VARCHAR(500) NOT NULL,
    closes VARCHAR(60) NOT NULL,
    yes INT NOT NULL DEFAULT 50,
    volume BIGINT NOT NULL DEFAULT 0,
    participants INT NOT NULL DEFAULT 0,
    hot TINYINT NOT NULL DEFAULT 0,
    trend VARCHAR(255) DEFAULT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_market_cat (category)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  `CREATE TABLE IF NOT EXISTS startups (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    pitch VARCHAR(500) NOT NULL,
    sector VARCHAR(80) NOT NULL,
    raised BIGINT NOT NULL DEFAULT 0,
    valuation BIGINT NOT NULL DEFAULT 0,
    growth INT NOT NULL DEFAULT 0,
    founders VARCHAR(190) DEFAULT NULL,
    logo_seed VARCHAR(60) DEFAULT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
  { table: "users", column: "avatar_url", ddl: "ALTER TABLE users ADD COLUMN avatar_url VARCHAR(255) DEFAULT NULL" },
  { table: "startups", column: "logo_url", ddl: "ALTER TABLE startups ADD COLUMN logo_url VARCHAR(255) DEFAULT NULL" },
];

const EXTRA_TABLES = [
  `CREATE TABLE IF NOT EXISTS site_settings (
    k VARCHAR(64) PRIMARY KEY,
    v TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

  `CREATE TABLE IF NOT EXISTS startup_investments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    startup_id VARCHAR(64) NOT NULL,
    startup_name VARCHAR(120) NOT NULL,
    amount BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_si_user (user_id),
    INDEX idx_si_startup (startup_id),
    CONSTRAINT fk_si_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
];

const c = await mysql.createConnection({
  host: DB_HOST, user: DB_USER, password: DB_PASSWORD,
  database: DB_NAME, port: Number(DB_PORT), multipleStatements: true,
});

console.log("Connected. Creating tables…");
for (const s of SCHEMA) await c.query(s);
for (const s of EXTRA_TABLES) await c.query(s);
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

// ── Seed markets + startups (only when empty) ──
function trendFor(yes, seed = 0) {
  const pts = [];
  const start = Math.max(5, Math.min(95, yes + ((seed % 5) - 2) * 6 - 14));
  for (let i = 0; i < 8; i++) {
    const t = i / 7;
    const wobble = Math.sin((seed + i) * 1.7) * 2.2;
    pts.push(Math.round(start + (yes - start) * t + wobble));
  }
  pts[7] = yes;
  return pts.map((p) => Math.max(2, Math.min(98, p)));
}

const SEED_MARKETS = [
  ["btc-150k","Crypto","BTC reaches $150K","Will Bitcoin close above $150,000 by December 31, 2026?","Dec 31, 2026",4820000,18420,62,1],
  ["eth-6pct","Crypto","ETH staking yield > 6%","Will Ethereum mainnet staking APR exceed 6% in Q3 2026?","Sep 30, 2026",1240000,6210,41,0],
  ["sol-300","Crypto","Solana above $300","Will SOL trade above $300 at any point in 2026?","Dec 31, 2026",980000,5120,48,0],
  ["btc-etf-100b","Crypto","BTC ETF AUM > $200B","Will spot Bitcoin ETFs hold over $200B in assets by year-end?","Dec 31, 2026",1510000,7340,55,1],
  ["stable-1t","Crypto","Stablecoin supply > $1T","Will total stablecoin market cap exceed $1 trillion in 2026?","Dec 31, 2026",720000,3980,34,0],
  ["xrp-case","Crypto","New crypto framework","Will the US pass a comprehensive crypto market-structure bill in 2026?","Dec 31, 2026",640000,4410,44,0],
  ["nvda-5t","Stocks","NVDA hits $5T market cap","Does NVIDIA close any session above $5T market cap in 2026?","Dec 31, 2026",3180000,12044,71,1],
  ["spx-7k","Stocks","S&P 500 above 7,000","Will the S&P 500 print above 7,000 before year-end?","Dec 31, 2026",2010000,9011,38,0],
  ["tsla-500","Stocks","Tesla above $500","Will Tesla close above $500 at any point in 2026?","Dec 31, 2026",1390000,8120,45,0],
  ["aapl-4t","Stocks","Apple holds $4T cap","Will Apple sustain a $4T+ market cap through Q4 2026?","Dec 31, 2026",1120000,6701,58,0],
  ["fed-cut","Stocks","Fed cuts below 3.5%","Will the Fed funds upper bound fall below 3.5% in 2026?","Dec 31, 2026",1640000,7720,52,1],
  ["ipo-2026","Stocks","Mega IPO > $20B","Will any 2026 IPO price at a $20B+ valuation?","Dec 31, 2026",540000,3110,36,0],
  ["euro-spain","Sports","Spain win next major","Will Spain win their next senior international tournament?","Jul 9, 2028",980000,7325,28,0],
  ["f1-verstappen","Sports","Verstappen title","Will Verstappen win the 2026 F1 Drivers' Championship?","Dec 7, 2026",1510000,8702,54,0],
  ["nba-finals","Sports","Celtics repeat","Will the Boston Celtics win the 2026 NBA Finals?","Jun 20, 2026",870000,5410,31,0],
  ["wc-2026","Sports","Host nation final","Will a 2026 World Cup host nation reach the final?","Jul 19, 2026",1260000,9120,22,1],
  ["wimbledon-26","Sports","Alcaraz Wimbledon","Will Carlos Alcaraz win Wimbledon 2026?","Jul 12, 2026",610000,4010,47,0],
  ["cricket-t20","Sports","India win T20 WC","Will India win the 2026 T20 World Cup?","Mar 8, 2026",1040000,11210,39,0],
  ["gpt6","Technology","OpenAI ships GPT-6","Will OpenAI publicly release GPT-6 by Q4 2026?","Dec 31, 2026",2640000,14219,47,1],
  ["apple-ar","Technology","Apple AR glasses","Will Apple announce consumer AR glasses in 2026?","Nov 1, 2026",870000,5901,33,0],
  ["agi-claim","Technology","Major AGI claim","Will a frontier lab publicly claim AGI in 2026?","Dec 31, 2026",1180000,8810,26,0],
  ["quantum-adv","Technology","Quantum advantage","Will a verifiable practical quantum advantage be demonstrated in 2026?","Dec 31, 2026",520000,3320,29,0],
  ["tiktok-us","Technology","TikTok US resolution","Will TikTok's US ownership be resolved (sale or ban) in 2026?","Dec 31, 2026",940000,7110,61,0],
  ["starlink-ipo","Technology","Starlink IPO","Will Starlink file to go public in 2026?","Dec 31, 2026",680000,4520,35,0],
  ["perplexity-ipo","Startups","Perplexity files S-1","Will Perplexity file for IPO by the end of 2026?","Dec 31, 2026",760000,4502,22,0],
  ["anduril-50b","Startups","Anduril $50B valuation","Will Anduril reach a $50B private valuation in 2026?","Dec 31, 2026",610000,3211,58,0],
  ["openai-1t","Startups","OpenAI $1T valuation","Will OpenAI's valuation reach $1T in 2026?","Dec 31, 2026",1320000,9810,43,1],
  ["spacex-400b","Startups","SpaceX $500B","Will SpaceX reach a $500B valuation in 2026?","Dec 31, 2026",880000,6120,49,0],
  ["stripe-ipo","Startups","Stripe IPO","Will Stripe go public in 2026?","Dec 31, 2026",700000,5210,27,0],
  ["anthropic-100b","Startups","Anthropic > $150B","Will Anthropic's valuation exceed $150B in 2026?","Dec 31, 2026",760000,6440,51,0],
  ["ai-viral","Trending","AI agent goes viral","Will an AI agent post exceed 100M impressions in a single day?","Aug 1, 2026",410000,2890,67,1],
  ["mars-window","Trending","Starship to Mars","Will SpaceX launch a Starship toward Mars in the 2026 window?","Dec 31, 2026",1240000,7901,19,0],
  ["box-office","Trending","$2B box office film","Will any 2026 film gross over $2B worldwide?","Dec 31, 2026",520000,4120,24,0],
  ["tour-record","Trending","Record concert tour","Will a 2026 concert tour gross over $1.5B?","Dec 31, 2026",360000,2610,41,0],
  ["meme-coin","Trending","Meme coin top 10","Will a meme coin enter the top 10 by market cap in 2026?","Dec 31, 2026",480000,5310,33,0],
  ["netflix-sub","Trending","Netflix > 350M subs","Will Netflix exceed 350M paid subscribers in 2026?","Dec 31, 2026",540000,4710,56,0],
  ["us-midterm","Politics","House control flips","Will the US House majority flip party in the 2026 midterms?","Nov 3, 2026",2180000,16420,52,1],
  ["uk-election","Politics","UK snap election","Will the UK hold a general election in 2026?","Dec 31, 2026",740000,5210,31,0],
  ["eu-ai-act","Politics","EU AI Act phase-in","Will the EU enforce full AI Act high-risk rules in 2026?","Dec 31, 2026",520000,3810,58,0],
  ["fed-chair","Politics","New Fed chair named","Will a new Federal Reserve chair be nominated in 2026?","Dec 31, 2026",880000,6120,46,0],
  ["gov-shutdown","Politics","US gov shutdown","Will there be a US federal government shutdown in 2026?","Dec 31, 2026",960000,7210,38,0],
  ["climate-deal","Politics","Global climate deal","Will COP31 produce a binding new emissions agreement?","Nov 30, 2026",430000,3120,27,0],
];

const SEED_STARTUPS = [
  ["lumen-ai","Lumen AI","Agentic research copilot for analysts.","AI / Productivity",18000000,220000000,38,"Ari, Kade","lumen"],
  ["orbit-pay","Orbit Pay","Programmable settlement rails for emerging markets.","Fintech",26000000,410000000,22,"Lyra, Noor","orbit"],
  ["nova-bio","NovaBio","Programmable mRNA design platform.","BioTech",41000000,760000000,17,"Indra, Rae","nova"],
  ["halo-energy","Halo Energy","Modular grid-scale sodium-ion batteries.","ClimateTech",32000000,540000000,28,"Mateo, Zen","halo"],
  ["echo-os","Echo OS","Spatial computing OS for prosumer headsets.","Hardware",12000000,180000000,44,"Yara, Devon","echo"],
  ["polaris-llm","Polaris","Open frontier model trained on verifiable data.","AI / Infra",55000000,980000000,32,"Ari, Indra","polaris"],
  ["verdant-ag","Verdant","Autonomous precision farming robotics.","AgriTech",21000000,300000000,26,"Noor, Mateo","verdant"],
  ["ledgerly","Ledgerly","Real-time compliance for cross-border payments.","Fintech",16000000,240000000,35,"Lyra, Zen","ledgerly"],
];

const [mc] = await c.query("SELECT COUNT(*) n FROM markets");
if (mc[0].n === 0) {
  let i = 0;
  for (const m of SEED_MARKETS) {
    const trend = trendFor(m[7], i).join(",");
    await c.query(
      "INSERT INTO markets (id,category,title,question,closes,volume,participants,yes,hot,trend,sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
      [m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], trend, i],
    );
    i++;
  }
  console.log(`Seeded ${SEED_MARKETS.length} markets`);
}

const [sc] = await c.query("SELECT COUNT(*) n FROM startups");
if (sc[0].n === 0) {
  let i = 0;
  for (const s of SEED_STARTUPS) {
    await c.query(
      "INSERT INTO startups (id,name,pitch,sector,raised,valuation,growth,founders,logo_seed,sort_order) VALUES (?,?,?,?,?,?,?,?,?,?)",
      [s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7], s[8], i],
    );
    i++;
  }
  console.log(`Seeded ${SEED_STARTUPS.length} startups`);
}

await c.end();
console.log("Done.");
