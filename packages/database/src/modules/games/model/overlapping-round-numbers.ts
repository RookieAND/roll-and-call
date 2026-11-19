export type RoundSpan = { startsAt: Date; endsAt: Date };

export type TargetRound = RoundSpan & { roundNo: number };

// 시작은 포함, 끝은 제외: 앞 회차의 끝과 뒤 회차의 시작이 같으면 겹치지 않는다.
export function rangesOverlap(a: RoundSpan, b: RoundSpan) {
  return a.startsAt.getTime() < b.endsAt.getTime() && b.startsAt.getTime() < a.endsAt.getTime();
}

// 겹치는 (목표 회차, 상대 회차) 쌍을 목표 회차 번호 순서로 돌려준다.
export function overlappingPairs<TOther extends RoundSpan>({
  target,
  others,
}: {
  target: readonly TargetRound[];
  others: readonly TOther[];
}): { targetRoundNo: number; other: TOther }[] {
  return target
    .toSorted((a, b) => a.roundNo - b.roundNo)
    .flatMap((round) =>
      others
        .filter((other) => rangesOverlap(round, other))
        .toSorted((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
        .map((other) => ({ targetRoundNo: round.roundNo, other })),
    );
}

// 다른 세션의 회차 가운데 하나라도 겹치는 목표 회차 번호를 오름차순으로 돌려준다.
export function overlappingRoundNumbers({
  target,
  others,
}: {
  target: readonly TargetRound[];
  others: readonly RoundSpan[];
}): number[] {
  return target
    .filter((round) => others.some((other) => rangesOverlap(round, other)))
    .map((round) => round.roundNo)
    .toSorted((a, b) => a - b);
}
