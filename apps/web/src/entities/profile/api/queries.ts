import { db } from "@/shared/api/db";

export async function getProfile(userId: string) {
  return db.query.profiles.findFirst({
    where: (p, { eq }) => eq(p.id, userId),
  });
}
