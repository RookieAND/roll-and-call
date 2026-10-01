"use server";

import { revalidatePath } from "next/cache";

import {
  getCurrentServer,
  requireStaff,
  updateCertEnforcementDate,
  type EnforcementChange,
} from "@/shared/server";

export async function changeEnforcementDate(date: Date, change: EnforcementChange) {
  const staff = await requireStaff();
  if (staff.role !== "owner") throw new Error("소유자만 적용일을 바꿀 수 있습니다");
  const server = await getCurrentServer();
  await updateCertEnforcementDate({ serverId: server.id, date, change, actor: staff });
  revalidatePath("/", "layout");
}
