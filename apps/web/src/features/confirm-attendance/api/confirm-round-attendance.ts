"use server";

import { z } from "zod";

import { idSchema, parseActionInput, type ActionResult } from "@/shared/api";
import { getActingMember, notMemberError } from "@/shared/server";

import { submitRoundAttendance } from "./submit-round-attendance";

const ABSENT_MAX = 40;

const inputSchema = z.object({
  gameId: idSchema,
  roundNo: z.number().int().min(1).max(52),
  absentUserIds: z.array(idSchema).max(ABSENT_MAX),
});

// 다회차 회차의 출석을 확정하거나 다시 고친다. 빠진 사람만 받고 불참 기록은 남기지 않는다.
export async function confirmRoundAttendance(
  input: z.input<typeof inputSchema>,
): Promise<ActionResult> {
  const parsed = parseActionInput(inputSchema, input);
  if (!parsed.ok) return parsed.result;
  const member = await getActingMember();
  if (!member) return { error: await notMemberError() };
  return submitRoundAttendance({
    actor: { serverId: member.server.id, slug: member.server.slug, gmId: member.user.id },
    ...parsed.data,
  });
}
