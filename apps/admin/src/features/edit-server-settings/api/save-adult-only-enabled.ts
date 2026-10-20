"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { parseActionInput } from "@/shared/lib";
import { getCurrentServer, requireOwner, updateAdultOnlyEnabled } from "@/shared/server";

const schema = z.object({ enabled: z.boolean() });

// 서버 설정을 바꿀 수 있는 소유자만 바꾼다(D407). 이미 올라간 구인은 바뀌지 않는다.
export async function saveAdultOnlyEnabled(args: { enabled: boolean }) {
  const actor = await requireOwner();
  const { enabled } = parseActionInput(schema, args);
  const server = await getCurrentServer();
  await updateAdultOnlyEnabled({ serverId: server.id, enabled, actor });
  revalidatePath("/", "layout");
}
