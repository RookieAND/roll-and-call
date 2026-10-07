import { SCHEDULE_MODE, type ScheduleMode } from "@/entities/game";
import { formatDateTime } from "@/shared/lib";

export const MY_DRAW_ACTION = {
  leaveWaitlist: "leave-waitlist",
  viewGame: "view-game",
} as const;

export type MyDrawAction = (typeof MY_DRAW_ACTION)[keyof typeof MY_DRAW_ACTION];

const WAITLIST_HINT = "자리가 나면 GM이 대기 명단에서 확정합니다.";

// 신청자 화면 하단 바(보드 12 G). 한 줄 버튼은 둘까지다.
export function myDrawFooter({
  confirmed,
  scheduleMode,
  confirmedAt,
  sessionEnded,
}: {
  confirmed: boolean;
  scheduleMode: ScheduleMode;
  confirmedAt: Date | null;
  sessionEnded: boolean;
}): { hint: string | null; actions: MyDrawAction[] } {
  const { leaveWaitlist, viewGame } = MY_DRAW_ACTION;
  if (!confirmed) {
    if (sessionEnded) return { hint: null, actions: [viewGame] };
    return { hint: WAITLIST_HINT, actions: [leaveWaitlist, viewGame] };
  }
  if (scheduleMode === SCHEDULE_MODE.fixed && confirmedAt) {
    return { hint: `${formatDateTime(confirmedAt)}에 진행합니다.`, actions: [viewGame] };
  }
  if (confirmedAt) {
    return { hint: `${formatDateTime(confirmedAt)}으로 확정되었습니다.`, actions: [viewGame] };
  }
  return { hint: "시간이 정해지면 알림 탭으로 알립니다.", actions: [viewGame] };
}
