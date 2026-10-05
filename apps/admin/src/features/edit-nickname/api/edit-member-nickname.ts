"use server";

import {
  parseReason,
  reasonLabel,
  type ChosenReason,
} from "@roll-and-call/database/moderation/model";
import { revalidatePath } from "next/cache";

import { editNickname, getCurrentServer, requireStaff } from "@/shared/server";

import { NICKNAME_REASON } from "../model/nickname-reasons";
import { followsNicknameRule } from "../model/nickname-rule";

interface EditMemberNicknameInput {
  expected: string;
  nickname: string;
  reason: ChosenReason | null;
  staffMemo: string;
}

// 성공하면 editNickname이 같은 트랜잭션에서 당사자 알림 탭에 알린다. 그사이 닉네임이 바뀌었으면 충돌로 돌려준다(D296).
export async function editMemberNickname({
  userId,
  input,
}: {
  userId: string;
  input: EditMemberNicknameInput;
}) {
  const staff = await requireStaff();
  if (!followsNicknameRule(input.nickname)) throw new Error("새 닉네임을 확인해 주세요");
  const reason = parseReason({ reason: input.reason, reasons: NICKNAME_REASON });
  const server = await getCurrentServer();
  const result = await editNickname({
    serverId: server.id,
    userId,
    actor: staff,
    input: {
      expected: input.expected,
      nickname: input.nickname,
      reason: reasonLabel({ ...reason, reasons: NICKNAME_REASON }),
      reasonTag: NICKNAME_REASON[reason.code as keyof typeof NICKNAME_REASON],
      staffMemo: input.staffMemo.trim(),
    },
  });
  revalidatePath("/", "layout");
  if (result.ok || "taken" in result) return result;
  const conflict = result.conflict;
  return {
    ok: false as const,
    conflict: conflict ? { by: conflict.by, at: conflict.at } : null,
    self: conflict?.byId === staff.id,
  };
}
