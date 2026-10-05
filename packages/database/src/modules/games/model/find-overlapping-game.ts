import { plannedEndAt, sessionEndAt } from "./session-timing";

type Moment = Date | string;

export type MySessionTiming = {
  id: string;
  confirmedAt: Moment;
  playMinutes: number | null;
  endedAt: Moment | null;
};

// 시작은 포함, 끝은 제외: 앞 세션의 끝과 뒤 세션의 시작이 같으면 겹치지 않는다.
function rangesOverlap(a: { start: Date; end: Date }, b: { start: Date; end: Date }) {
  return a.start.getTime() < b.end.getTime() && b.start.getTime() < a.end.getTime();
}

// 신청하려는 구인(예정 종료까지)과 겹치는 내 세션을 시작 시각 순으로 돌려준다. 끝난 세션은 실제 종료 시각으로 본다.
export function findOverlappingGame({
  target,
  mine,
}: {
  target: { startsAt: Moment; playMinutes: number | null };
  mine: readonly MySessionTiming[];
}): MySessionTiming[] {
  const targetRange = {
    start: new Date(target.startsAt),
    end: plannedEndAt({ confirmedAt: target.startsAt, playMinutes: target.playMinutes })!,
  };
  return mine
    .filter((session) =>
      rangesOverlap(targetRange, {
        start: new Date(session.confirmedAt),
        end: sessionEndAt(session)!,
      }),
    )
    .toSorted((a, b) => new Date(a.confirmedAt).getTime() - new Date(b.confirmedAt).getTime());
}
