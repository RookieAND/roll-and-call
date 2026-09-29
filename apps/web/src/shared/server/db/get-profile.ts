import "server-only";
import { db } from "@roll-and-call/database";
import { cache } from "react";
import { z } from "zod";

// uuid가 아닌 값을 넘기면 Postgres가 캐스팅 에러를 던지므로 없는 사용자로 본다.
export const getProfile = cache(async (userId: string) => {
  if (!z.uuid().safeParse(userId).success) return undefined;
  return db.query.profiles.findFirst({
    where: (profile, { eq }) => eq(profile.id, userId),
  });
});
