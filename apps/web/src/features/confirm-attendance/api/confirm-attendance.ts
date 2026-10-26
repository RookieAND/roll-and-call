"use server";

import { z } from "zod";

import { idSchema, parseActionInput, type ActionResult } from "@/shared/api";
import { getActingMember, notMemberError } from "@/shared/server";

import { ABSENCE_REASON_MAX_LENGTH } from "../model/absences-error";
import { submitAttendance } from "./submit-attendance";

// 정원 상한 20명에 대기·불참까지 더해도 넘지 않을 값.
const ABSENCES_MAX = 40;
// 사유의 길이 안내는 absencesError가 한다. 여기서는 터무니없이 긴 입력만 막는다.
const REASON_INPUT_MAX = ABSENCE_REASON_MAX_LENGTH * 5;

const inputSchema = z.object({
  gameId: idSchema,
  absences: z
    .array(z.object({ userId: idSchema, reason: z.string().max(REASON_INPUT_MAX).nullable() }))
    .max(ABSENCES_MAX),
});

export async function confirmAttendance(input: z.input<typeof inputSchema>): Promise<ActionResult> {
  const parsed = parseActionInput(inputSchema, input);
  if (!parsed.ok) return parsed.result;
  const member = await getActingMember();
  if (!member) return { error: await notMemberError() };
  return submitAttendance({
    actor: { serverId: member.server.id, slug: member.server.slug, gmId: member.user.id },
    gameId: parsed.data.gameId,
    absences: parsed.data.absences,
  });
}
