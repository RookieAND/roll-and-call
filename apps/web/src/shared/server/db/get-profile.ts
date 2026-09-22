import "server-only";
import { db } from "@roll-and-call/database";

export async function getProfile(userId: string) {
  return db.query.profiles.findFirst({
    where: (profile, { eq }) => eq(profile.id, userId),
  });
}
