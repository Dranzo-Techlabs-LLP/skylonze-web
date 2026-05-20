import { getUserSession } from "./auth";
import { findById, toPublic, type PublicUser } from "./users";

/** Server-side: resolve the current logged-in user (full public row) or null. */
export async function getCurrentUser(): Promise<PublicUser | null> {
  const sess = await getUserSession();
  if (!sess) return null;
  const user = await findById(sess.uid);
  if (!user || user.status === "suspended") return null;
  return toPublic(user);
}
