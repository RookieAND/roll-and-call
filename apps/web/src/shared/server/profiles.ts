import "server-only";
import { db } from "@/shared/server";
export async function getProfile(userId: string) {
  return db.query.profiles.findFirst({
    where: (p, { eq }) => eq(p.id, userId),
  });
}
