"use server";

import { revalidatePath } from "next/cache";

import {
  addRulebook,
  approveRulebookRequest,
  getCurrentServer,
  requireStaff,
} from "@/shared/server";

import type { RulebookDraft } from "../model/rulebook-draft";
import { toRulebookFields } from "../model/to-rulebook-fields";

// 추가 페이지 한 곳에서 새 룰북 추가와 추가 요청 승인을 함께 받는다. requestId가 있으면 요청을 처리됨으로 바꾼다.
export async function submitRulebookNew({
  requestId,
  draft,
  miniRule,
  reason,
}: {
  requestId: string | null;
  draft: RulebookDraft;
  miniRule: boolean;
  reason: string;
}) {
  const staff = await requireStaff();
  const fields = { ...toRulebookFields(draft), miniRule };
  if (!fields.name || !reason.trim()) throw new Error("룰북 이름과 변경 사유를 입력해 주세요");
  const server = await getCurrentServer();
  const result = requestId
    ? await approveRulebookRequest({
        serverId: server.id,
        id: requestId,
        actor: staff,
        fields,
        reason: reason.trim(),
      })
    : await addRulebook({ serverId: server.id, fields, actor: staff, reason: reason.trim() });
  revalidatePath("/", "layout");
  return result;
}
