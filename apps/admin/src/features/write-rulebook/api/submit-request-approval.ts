"use server";

import { revalidatePath } from "next/cache";

import { approveRulebookRequest, requireStaff } from "@/shared/server";

import type { RulebookDraft } from "../model/rulebook-draft";
import { toRulebookFields } from "../model/to-rulebook-fields";

export async function submitRequestApproval(
  requestId: string,
  draft: RulebookDraft,
  reason: string,
) {
  const staff = await requireStaff();
  const fields = toRulebookFields(draft);
  if (!fields.name || !reason.trim()) throw new Error("룰북 이름과 변경 사유를 입력해 주세요");
  const result = await approveRulebookRequest(requestId, staff, fields, reason.trim());
  revalidatePath("/", "layout");
  return result;
}
