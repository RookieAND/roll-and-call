import "server-only";
import { db } from "./db";

export async function getProfile(userId: string) {
  return db.query.profiles.findFirst({
    where: (profile, { eq }) => eq(profile.id, userId),
  });
}
