"use server";

import { z } from "zod";

import { idSchema, parseActionInput } from "@/shared/lib";
import { getCurrentServer, isNicknameTaken, requireStaff } from "@/shared/server";

import {
  followsNicknameRule,
  NICKNAME_RULE_ERROR,
  NICKNAME_TAKEN_ERROR,
} from "../model/nickname-rule";

const checkNicknameSchema = z.object({ userId: idSchema, nickname: z.string().max(100) });

// 입력하는 동안 규칙과 중복을 확인한다. 쓸 수 있으면 null.
interface CheckNicknameInput {
  userId: string;
  nickname: string;
}

export async function checkNickname(args: CheckNicknameInput) {
  await requireStaff();
  const { userId, nickname } = parseActionInput(checkNicknameSchema, args);
  if (!followsNicknameRule(nickname)) return NICKNAME_RULE_ERROR;
  const server = await getCurrentServer();
  if (await isNicknameTaken({ serverId: server.id, userId, nickname })) return NICKNAME_TAKEN_ERROR;
  return null;
}
