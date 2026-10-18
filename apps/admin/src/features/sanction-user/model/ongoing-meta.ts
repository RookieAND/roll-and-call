import type { MemberOngoingRow } from "@/entities/user/server";
import { formatFullSessionTime, ONGOING_ROLE } from "@/shared/lib";

export function ongoingMeta(activity: MemberOngoingRow) {
  const when = activity.startsAt ? formatFullSessionTime(activity.startsAt) : "일정 미정";
  if (activity.role === ONGOING_ROLE.gm) {
    return `${when} · ${activity.statusLabel} ${activity.confirmedCount}/${activity.capacity} · 본인이 GM`;
  }
  const state = activity.role === ONGOING_ROLE.confirmed ? "참여 확정" : "대기";
  return `${when} · ${state} · GM ${activity.gmNickname}`;
}
