"use server";

import { saveMemberAvailability } from "@roll-and-call/database/profiles";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { normalizeAvailability } from "@/entities/profile";
import { parseActionInput, type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import { getActingMember, notMemberError } from "@/shared/server";

import { availabilityReturnPath } from "../model/availability-return-path";

// 요일 7칸에 하루 24구간이 상한이다. 값의 범위는 normalizeAvailability가 걸러 낸다.
const INTERVALS_MAX = 7 * 24;
const FROM_MAX_LENGTH = 20;

const inputSchema = z.object({
  intervals: z
    .array(z.object({ day: z.number(), from: z.number(), to: z.number() }))
    .max(INTERVALS_MAX),
  from: z.string().max(FROM_MAX_LENGTH).optional(),
});

export async function updateAvailability(
  input: z.input<typeof inputSchema>,
): Promise<ActionResult> {
  const parsed = parseActionInput(inputSchema, input);
  if (!parsed.ok) return parsed.result;
  const { intervals, from } = parsed.data;
  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;

  await saveMemberAvailability({
    serverId: server.id,
    userId: user.id,
    availability: normalizeAvailability(intervals),
  });

  revalidatePath(serverPath({ slug: server.slug, path: "/me" }));
  redirect(serverPath({ slug: server.slug, path: availabilityReturnPath(from) }));
}
