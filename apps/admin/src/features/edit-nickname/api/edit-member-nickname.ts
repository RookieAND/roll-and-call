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

export async function editMemberNickname(userId: string, input: EditMemberNicknameInput) {
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
  return result;
}
