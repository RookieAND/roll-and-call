import type { Snapshot } from "./snapshot";
import type { Session } from "./types";

// 활동 기록에서 구인 조치의 대상 문구. GM이 받은 조치도 이 문구로 센다.
export function postAuditTarget(db: Snapshot, session: Session) {
  const gm = db.users.find((user) => user.id === session.gmId)!;
  return `${session.title} · GM ${gm.nickname}`;
}
