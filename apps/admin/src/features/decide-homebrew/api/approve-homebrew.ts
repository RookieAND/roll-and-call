"use server";

import { grantWorldOwnerBadge } from "@roll-and-call/database/badges";
import { decideHomebrewApplication } from "@roll-and-call/database/homebrew";
import { revalidatePath } from "next/cache";
import { after } from "next/server";

import { idSchema, parseActionInput } from "@/shared/lib";
import { getCurrentServer, requireStaff, syncHomebrewStaffNotice } from "@/shared/server";

// 서버 운영진 누구나, 본인 신청도 승인할 수 있다. 사용 범위는 늘 제작자만 사용으로 시작한다.
// 제작자는 세계의 주인을 받는다(이미 있으면 다시 주지 않는다). 알림은 업적 알림 경로로 간다.
export async function approveHomebrew(rawApplicationId: string) {
  const staff = await requireStaff();
  const applicationId = parseActionInput(idSchema, rawApplicationId);
  const server = await getCurrentServer();
  const result = await decideHomebrewApplication({
    serverId: server.id,
    id: applicationId,
    actor: staff,
    decision: { kind: "approve" },
  });
  revalidatePath("/", "layout");
  if (result.ok) {
    after(() => grantWorldOwnerBadge({ serverId: server.id, userId: result.userId }));
    after(() => syncHomebrewStaffNotice({ server, applicationId }));
  }
  return result;
}
