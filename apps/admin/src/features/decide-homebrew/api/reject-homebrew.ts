"use server";

import { decideHomebrewApplication } from "@roll-and-call/database/homebrew";
import { HOMEBREW_LIMIT } from "@roll-and-call/database/homebrew/model";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { z } from "zod";

import { idSchema, OTHER_REASON, parseActionInput } from "@/shared/lib";
import { getCurrentServer, requireStaff, syncHomebrewStaffNotice } from "@/shared/server";

import { HOMEBREW_REJECT_REASONS } from "../model/homebrew-reject-reasons";

const TAGS = HOMEBREW_REJECT_REASONS.map(({ name }) => name).filter(
  (name) => name !== OTHER_REASON,
);

const rejectHomebrewSchema = z.object({
  applicationId: idSchema,
  // 고른 사유 칩 이름. 기타면 null이고 userReason이 사유다.
  reasonTag: z.enum(TAGS as [string, ...string[]]).nullable(),
  userReason: z.string().max(HOMEBREW_LIMIT.rejectReasonLength),
});

export async function rejectHomebrew(input: z.input<typeof rejectHomebrewSchema>) {
  const staff = await requireStaff();
  const { applicationId, reasonTag, userReason } = parseActionInput(rejectHomebrewSchema, input);
  const reason = userReason.trim();
  if (!reasonTag && !reason) throw new Error("신청자에게 보일 문구를 입력해 주세요");
  const server = await getCurrentServer();
  const result = await decideHomebrewApplication({
    serverId: server.id,
    id: applicationId,
    actor: staff,
    decision: { kind: "reject", reasonTag, userReason: reason },
  });
  revalidatePath("/", "layout");
  if (result.ok) after(() => syncHomebrewStaffNotice({ server, applicationId }));
  return result;
}
