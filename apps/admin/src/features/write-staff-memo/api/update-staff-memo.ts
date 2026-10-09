"use server";

import { revalidatePath } from "next/cache";
import { forbidden } from "next/navigation";
import { z } from "zod";

import { idSchema, parseActionInput } from "@/shared/lib";
import { editStaffMemo, getCurrentServer, requireStaff } from "@/shared/server";

// 쓴 사람과 서버 소유자(플랫폼 관리자 포함)만 고친다. 그사이 지워진 메모면 { ok: false }.
const schema = z.object({ memoId: idSchema, body: z.string().max(5000) });

export async function updateStaffMemo(args: { memoId: string; body: string }) {
  const staff = await requireStaff();
  const { memoId, body } = parseActionInput(schema, args);
  if (!body.trim()) return { ok: false as const, error: "메모를 입력해 주세요" };
  const server = await getCurrentServer();
  const result = await editStaffMemo({
    serverId: server.id,
    memoId,
    actor: staff,
    owner: staff.role === "owner",
    body: body.trim(),
  });
  if (!result.ok && result.reason === "forbidden") forbidden();
  revalidatePath("/", "layout");
  return { ok: result.ok };
}
