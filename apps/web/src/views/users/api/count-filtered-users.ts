"use server";

import { countServerUsers } from "@roll-and-call/database/profiles";
import { z } from "zod";

import { parseActionInput } from "@/shared/api";
import { getActingMember } from "@/shared/server";

import { parseUsersFilter } from "../model/parse-users-filter";

const countSchema = z.object({ filter: z.record(z.string(), z.unknown()) });

// 필터 시트의 [유저 N명 보기] 숫자. 주소 값과 같은 모양으로 받아 서버에서 다시 검사한다(클라이언트 값을 믿지 않는다).
export async function countFilteredUsers({
  filter,
}: {
  filter: Partial<Record<"q" | "cert" | "host" | "recruiting", unknown>>;
}): Promise<number> {
  const parsed = parseActionInput(countSchema, { filter });
  if (!parsed.ok) return 0;
  const member = await getActingMember();
  if (!member) return 0;
  const { q, cert, host, recruiting } = parseUsersFilter(filter);
  return countServerUsers({
    serverId: member.server.id,
    q,
    certifiedRulebookId: cert,
    hostedRulebookId: host,
    recruitingOnly: recruiting,
  });
}
