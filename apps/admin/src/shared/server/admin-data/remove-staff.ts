import "server-only";
import { STAFF_ROLE_LABEL } from "@/shared/lib";

import { db } from "./mock-db";
import { recordAudit } from "./record-audit";

interface RemoveStaffInput {
  reason: string;
  notify: boolean;
}

// ponytail: notify는 활동 기록에만 남긴다. 디스코드 DM은 알림 채널이 생기면 보낸다.
export async function removeStaff(nickname: string, actor: string, input: RemoveStaffInput) {
  const index = db.staff.findIndex((staff) => staff.nickname === nickname);
  const staff = db.staff[index];
  if (!staff) throw new Error("운영진을 찾을 수 없습니다");
  if (staff.role === "owner") throw new Error("소유자는 해제할 수 없습니다");
  db.staff.splice(index, 1);
  recordAudit({
    actor,
    action: "운영진 해제",
    target: `${nickname} · ${STAFF_ROLE_LABEL[staff.role]}`,
    reason: input.reason,
    before: { label: STAFF_ROLE_LABEL[staff.role] },
    after: { label: "일반 유저" },
    related: input.notify ? ["당사자에게 디스코드 알림 보냄"] : [],
  });
}
