"use server";

import { getMemberNickname } from "@roll-and-call/database/profiles";
import {
  MESSAGE_CASES,
  type MessageCaseKey,
  validateMessageHead,
} from "@roll-and-call/database/servers/model";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { parseActionInput } from "@/shared/lib";
import { getCurrentServer, requireOwner, saveMessageHead } from "@/shared/server";

const saveHeadSchema = z.object({
  key: z.custom<MessageCaseKey>((value) => MESSAGE_CASES.some((entry) => entry.key === value)),
  headLine: z.string().max(2000),
  expectedUpdatedAt: z.string().max(64).nullable(),
}) satisfies z.ZodType<SaveMessageHeadInput>;

interface SaveMessageHeadInput {
  key: MessageCaseKey;
  headLine: string;
  // 편집을 시작할 때 읽은 저장 시각(ISO). 아직 저장된 적이 없으면 null.
  expectedUpdatedAt: string | null;
}

type SaveMessageHeadResult =
  | { ok: true }
  | { ok: false; error: string }
  | { ok: false; conflict: { by: string; at: Date | null } };

export async function saveMessageHeadAction(
  args: SaveMessageHeadInput,
): Promise<SaveMessageHeadResult> {
  const actor = await requireOwner();
  const { key, headLine, expectedUpdatedAt } = parseActionInput(saveHeadSchema, args);
  const label = MESSAGE_CASES.find((messageCase) => messageCase.key === key)?.label;
  if (!label) return { ok: false, error: "알 수 없는 경우입니다." };
  const text = headLine.trim();
  const error = validateMessageHead({ key, text });
  if (error) return { ok: false, error };

  const server = await getCurrentServer();
  const result = await saveMessageHead({
    serverId: server.id,
    key,
    label,
    headLine: text,
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
