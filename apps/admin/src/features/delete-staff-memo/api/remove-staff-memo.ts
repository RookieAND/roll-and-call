"use server";

import { revalidatePath } from "next/cache";
import { forbidden } from "next/navigation";

import { idSchema, parseActionInput } from "@/shared/lib";
import { deleteStaffMemo, getCurrentServer, requireStaff } from "@/shared/server";

// 쓴 사람과 서버 소유자(플랫폼 관리자 포함)만 지운다. 그사이 지워진 메모면 { ok: false }.
export async function removeStaffMemo(args: { memoId: string }) {
  const staff = await requireStaff();
  const memoId = parseActionInput(idSchema, args.memoId);
  const server = await getCurrentServer();
  const result = await deleteStaffMemo({
    serverId: server.id,
    memoId,
    actor: staff,
    owner: staff.role === "owner",
  });
  if (!result.ok && result.reason === "forbidden") forbidden();
  revalidatePath("/", "layout");
  return { ok: result.ok };
}
