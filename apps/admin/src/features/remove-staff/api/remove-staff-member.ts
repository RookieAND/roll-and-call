"use server";

import { revalidatePath } from "next/cache";

import { removeStaff, requireStaff } from "@/shared/server";

interface RemoveStaffMemberInput {
  reason: string;
  notify: boolean;
}

export async function removeStaffMember(nickname: string, input: RemoveStaffMemberInput) {
  const staff = await requireStaff();
  if (staff.role !== "owner") throw new Error("소유자만 운영진을 해제할 수 있습니다");
  if (!input.reason.trim()) throw new Error("해제 사유를 입력해 주세요");
  await removeStaff(nickname, staff.nickname, {
    reason: input.reason.trim(),
    notify: input.notify,
  });
  revalidatePath("/", "layout");
}
