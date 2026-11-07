"use server";

import { changeHomebrewScope } from "@roll-and-call/database/homebrew";
import { HOMEBREW_RULE_SCOPES } from "@roll-and-call/database/homebrew/model";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { idSchema, parseActionInput } from "@/shared/lib";
import { getCurrentServer, requireStaff } from "@/shared/server";

const schema = z.object({
  rulebookId: idSchema,
  from: z.enum(HOMEBREW_RULE_SCOPES),
  to: z.enum(HOMEBREW_RULE_SCOPES),
});

// 토스트 [되돌리기]는 from·to를 바꿔 다시 부른다. 웹 룰북 선택 시트는 다음 요청부터 새 범위로 거른다.
export async function changeHomebrewScopeAction(input: z.input<typeof schema>) {
  const staff = await requireStaff();
  const { rulebookId, from, to } = parseActionInput(schema, input);
  const server = await getCurrentServer();
  const result = await changeHomebrewScope({
    serverId: server.id,
    rulebookId,
    from,
    to,
    actor: staff,
  });
  revalidatePath("/", "layout");
  return result;
}
