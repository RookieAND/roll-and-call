"use server";

import { isUsernameTaken, requireStaff } from "@/shared/server";

import {
  followsNicknameRule,
  NICKNAME_RULE_ERROR,
  NICKNAME_TAKEN_ERROR,
} from "../model/nickname-rule";

// 입력하는 동안 규칙과 중복을 확인한다. 쓸 수 있으면 null.
export async function checkNickname(userId: string, nickname: string) {
  await requireStaff();
  if (!followsNicknameRule(nickname)) return NICKNAME_RULE_ERROR;
  if (await isUsernameTaken({ userId, username: nickname })) return NICKNAME_TAKEN_ERROR;
  return null;
}
