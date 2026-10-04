"use server";

import { saveMemberAvailability } from "@roll-and-call/database/profiles";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { normalizeAvailability, type AvailabilityInterval } from "@/entities/profile";
import { type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import { getActingMember, notMemberError } from "@/shared/server";

import { availabilityReturnPath } from "../model/availability-return-path";

export async function updateAvailability({
  intervals,
  from,
}: {
  intervals: AvailabilityInterval[];
  from?: string;
}): Promise<ActionResult> {
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
