import "server-only";
import { db } from "./mock-db";
import { recordAudit } from "./record-audit";
import { toNoShowRow } from "./to-no-show-row";

export type CancelNoShowResult =
  | { ok: true }
  | { ok: false; conflict: { by: string; at: Date; reason: string } };

// 이미 다른 운영진이 취소했으면 아무것도 바꾸지 않고 충돌을 알린다.
export async function cancelNoShow(
  id: string,
  actor: string,
  reason: string,
): Promise<CancelNoShowResult> {
  const noShow = db.noShows.find((candidate) => candidate.id === id);
  if (!noShow) throw new Error("불참 기록을 찾을 수 없습니다");
  if (!reason.trim()) throw new Error("취소 사유를 입력해 주세요");
  if (noShow.cancelled) {
    return {
      ok: false,
      conflict: { by: noShow.cancelledBy!, at: noShow.cancelledAt!, reason: noShow.cancelReason! },
    };
  }

  Object.assign(noShow, {
    cancelled: true,
    cancelledBy: actor,
    cancelledAt: new Date(),
    cancelReason: reason.trim(),
  });
  const row = toNoShowRow(noShow);
  recordAudit({
    actor,
    action: "불참 취소",
    target: `${row.nickname} · ${row.sessionTitle}`,
    reason: reason.trim(),
  });
  return { ok: true };
}
