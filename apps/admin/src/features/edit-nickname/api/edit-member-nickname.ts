"use server";

import { revalidatePath } from "next/cache";

import { editNickname, getCurrentServer, requireStaff } from "@/shared/server";

import { NICKNAME_REASONS, type NicknameReason } from "../model/nickname-reasons";
import { followsNicknameRule } from "../model/nickname-rule";

interface EditMemberNicknameInput {
  expected: string;
  nickname: string;
  reasonTag: NicknameReason;
  reason: string;
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
  const reason = input.reason.trim();
  if (
    !followsNicknameRule(input.nickname) ||
    !NICKNAME_REASONS.includes(input.reasonTag) ||
    !reason
  ) {
    throw new Error("새 닉네임과 수정 사유를 확인해 주세요");
  }
  const server = await getCurrentServer();
  const result = await editNickname({
    serverId: server.id,
    userId,
    actor: staff,
    input: {
      expected: input.expected,
      nickname: input.nickname,
      reason,
      reasonTag: input.reasonTag,
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
