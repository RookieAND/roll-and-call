"use server";

import { withdrawHomebrewApplication } from "@roll-and-call/database/homebrew";
import { redirect } from "next/navigation";
import { after } from "next/server";

import { idSchema, parseActionInput, type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import { getActingMember, notMemberError, syncHomebrewStaffNotice } from "@/shared/server";

import { HOMEBREW_ERROR } from "../model/homebrew-error";

// 거둔 신청은 내 룰북 목록에서 빠지고, 이미지는 30일 뒤 정리된다.
export async function withdrawHomebrew(input: string): Promise<ActionResult> {
  const parsed = parseActionInput(idSchema, input);
  if (!parsed.ok) return parsed.result;
  const member = await getActingMember();
  if (!member) return { error: await notMemberError() };
  const { server, user } = member;
  const withdrawn = await withdrawHomebrewApplication({
    serverId: server.id,
    userId: user.id,
    id: parsed.data,
  });
  if (!withdrawn) return { error: HOMEBREW_ERROR.alreadyProcessed };
  after(() => syncHomebrewStaffNotice({ server, applicationId: parsed.data }));
  redirect(serverPath({ slug: server.slug, path: "/me/rulebooks" }));
}
