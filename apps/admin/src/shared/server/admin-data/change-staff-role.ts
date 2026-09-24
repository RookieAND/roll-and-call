import "server-only";
import { STAFF_ROLE_LABEL } from "@/shared/lib";

import { db } from "./mock-db";
import { recordAudit } from "./record-audit";
import type { StaffRole } from "./types";

export async function changeStaffRole(nickname: string, role: StaffRole, actor: string) {
  const staff = db.staff.find((candidate) => candidate.nickname === nickname);
  if (!staff) throw new Error("운영진을 찾을 수 없습니다");
  if (staff.role === role) return;
  const before = staff.role;
  staff.role = role;
  recordAudit({
    actor,
    action: "역할 변경",
    target: `${nickname} · ${STAFF_ROLE_LABEL[role]}`,
    reason: "",
    before: { label: STAFF_ROLE_LABEL[before] },
    after: { label: STAFF_ROLE_LABEL[role] },
  });
}
