import { SCHEDULE_MODE, type ScheduleMode } from "@/entities/game";

// 구인 수정으로 세션 시각이 바뀌는 것은 일시 지정형뿐이다. 조율형은 세션 시간 결정(W03)이 맡는다.
export function sessionTimeChanged({
  scheduleMode,
  previous,
  next,
}: {
  scheduleMode: ScheduleMode;
  previous: Date | null;
  next: Date | undefined;
}): boolean {
  if (scheduleMode !== SCHEDULE_MODE.fixed || !next) return false;
  return previous?.getTime() !== next.getTime();
}
