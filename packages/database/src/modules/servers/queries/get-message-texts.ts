import { eq } from "drizzle-orm";

import { db } from "#/client";
import { serverMessageTexts } from "#/schema";

import { defaultMessageText, MESSAGE_TEXTS, type MessageTextKey } from "../model/message-texts";

export interface MessageText {
  body: string;
  updatedAt: Date | null;
}

// 저장된 행이 없는 문장은 기본 문장과 updatedAt null로 채워 모두 돌려준다.
export async function getMessageTexts({ serverId }: { serverId: string }) {
  const rows = await db
    .select()
    .from(serverMessageTexts)
    .where(eq(serverMessageTexts.serverId, serverId));
  return Object.fromEntries(
    MESSAGE_TEXTS.map(({ key }) => {
      const row = rows.find((candidate) => candidate.textKey === key);
      return [
        key,
        { body: row?.body ?? defaultMessageText(key), updatedAt: row?.updatedAt ?? null },
      ];
    }),
  ) as Record<MessageTextKey, MessageText>;
}
