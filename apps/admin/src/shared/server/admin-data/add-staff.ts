import "server-only";
import { STAFF_ROLE_LABEL } from "@/shared/lib";

import { db } from "./mock-db";
import { recordAudit } from "./record-audit";
import type { StaffRole } from "./types";

// ponytail: 당사자 디스코드 알림은 아직 보내지 않는다. 알림 채널이 생기면 여기서 보낸다.
export async function addStaff(userId: string, role: StaffRole, actor: string) {
  const user = db.users.find((candidate) => candidate.id === userId);
  if (!user) throw new Error("유저를 찾을 수 없습니다");
  if (db.staff.some((staff) => staff.nickname === user.nickname)) {
    throw new Error("이미 운영진입니다");
  }
  db.staff.push({ nickname: user.nickname, role, discordId: user.discordId, since: new Date() });
  recordAudit({
    actor,
    action: "운영진 추가",
    target: `${user.nickname} · ${STAFF_ROLE_LABEL[role]}`,
    reason: "",
    before: { label: "일반 유저" },
    after: { label: STAFF_ROLE_LABEL[role] },
  });
}
