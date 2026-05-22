import crypto from "crypto";

/** Random URL-safe token + its sha256 hash (store the hash, email the token). */
export function makeToken() {
  const token = crypto.randomBytes(32).toString("hex");
  const hash = hashToken(token);
  return { token, hash };
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function verifyExpiry(hours = 24) {
  return new Date(Date.now() + hours * 3600 * 1000);
}
