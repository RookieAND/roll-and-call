"use server";

import { getMemberNickname } from "@roll-and-call/database/profiles";
import {
  MESSAGE_TEXTS,
  type MessageTextKey,
  validateMessageText,
} from "@roll-and-call/database/servers/model";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { parseActionInput } from "@/shared/lib";
import { getCurrentServer, requireOwner, saveMessageText } from "@/shared/server";

const saveTextSchema = z.object({
  key: z.custom<MessageTextKey>((value) => MESSAGE_TEXTS.some((entry) => entry.key === value)),
  body: z.string().max(2000),
  expectedUpdatedAt: z.string().max(64).nullable(),
}) satisfies z.ZodType<SaveMessageTextInput>;

interface SaveMessageTextInput {
  key: MessageTextKey;
  body: string;
  // 편집을 시작할 때 읽은 저장 시각(ISO). 아직 저장된 적이 없으면 null.
  expectedUpdatedAt: string | null;
}

type SaveMessageTextResult =
  | { ok: true }
  | { ok: false; error: string }
  | { ok: false; conflict: { by: string; at: Date | null } };

export async function saveMessageTextAction(
  args: SaveMessageTextInput,
): Promise<SaveMessageTextResult> {
  const actor = await requireOwner();
  const { key, body, expectedUpdatedAt } = parseActionInput(saveTextSchema, args);
  const label = MESSAGE_TEXTS.find((text) => text.key === key)?.label;
  if (!label) return { ok: false, error: "알 수 없는 문장입니다." };
  const text = body.trim();
  const error = validateMessageText({ key, text });
  if (error) return { ok: false, error };

  const server = await getCurrentServer();
  const result = await saveMessageText({
    serverId: server.id,
    key,
    label,
    body: text,
    expectedUpdatedAt: expectedUpdatedAt ? new Date(expectedUpdatedAt) : null,
    actor,
  });
  if (!result.ok) {
    const by = result.conflict.by
      ? await getMemberNickname({ serverId: server.id, userId: result.conflict.by })
      : null;
    revalidatePath("/", "layout");
    return { ok: false, conflict: { by: by ?? "다른 운영진", at: result.conflict.at } };
  }
  revalidatePath("/", "layout");
  return { ok: true };
}
