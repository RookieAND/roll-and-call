"use server";

import { getCurrentServer, isNicknameTaken, requireStaff } from "@/shared/server";

import {
  followsNicknameRule,
  NICKNAME_RULE_ERROR,
  NICKNAME_TAKEN_ERROR,
} from "../model/nickname-rule";

// 입력하는 동안 규칙과 중복을 확인한다. 쓸 수 있으면 null.
interface CheckNicknameInput {
  userId: string;
  nickname: string;
}

export async function checkNickname({ userId, nickname }: CheckNicknameInput) {
  await requireStaff();
  if (!followsNicknameRule(nickname)) return NICKNAME_RULE_ERROR;
  const server = await getCurrentServer();
  if (await isNicknameTaken({ serverId: server.id, userId, nickname })) return NICKNAME_TAKEN_ERROR;
  return null;
}
