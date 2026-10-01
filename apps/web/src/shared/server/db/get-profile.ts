import "server-only";
import { findMemberProfile } from "@roll-and-call/database/profiles";
import { cache } from "react";
import { z } from "zod";

// cache는 인자를 Object.is로 견주므로 객체 대신 값 둘을 받는다.
// uuid가 아닌 값을 넘기면 Postgres가 캐스팅 에러를 던지므로 없는 사용자로 본다.
export const getProfile = cache(async (serverId: string, userId: string) => {
  if (!z.uuid().safeParse(userId).success) return undefined;
  return findMemberProfile({ serverId, userId });
});
