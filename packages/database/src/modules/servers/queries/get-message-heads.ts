import { eq } from "drizzle-orm";

import { db } from "#/client";
import { serverMessageHeads } from "#/schema";

import { defaultMessageHead, MESSAGE_CASES, type MessageCaseKey } from "../model/message-heads";

export interface MessageHead {
  headLine: string;
  updatedAt: Date | null;
}

// 저장된 행이 없는 경우는 기본 머리 줄과 updatedAt null로 채워 열 개를 모두 돌려준다.
export async function getMessageHeads({ serverId }: { serverId: string }) {
  const rows = await db
    .select()
    .from(serverMessageHeads)
    .where(eq(serverMessageHeads.serverId, serverId));
  return Object.fromEntries(
    MESSAGE_CASES.map(({ key }) => {
      const row = rows.find((candidate) => candidate.caseKey === key);
      return [
        key,
        { headLine: row?.headLine ?? defaultMessageHead(key), updatedAt: row?.updatedAt ?? null },
      ];
    }),
  ) as Record<MessageCaseKey, MessageHead>;
}
