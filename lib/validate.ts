export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
export const isHandle = (s: string) => /^[a-z0-9._-]{3,30}$/.test(s);

export function passwordIssue(p: string): string | null {
  if (p.length < 8) return "Password must be at least 8 characters.";
  if (!/[a-zA-Z]/.test(p)) return "Password must contain a letter.";
  if (!/[0-9]/.test(p)) return "Password must contain a number.";
  return null;
}

export function cleanHandle(s: string) {
  return s.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
}
