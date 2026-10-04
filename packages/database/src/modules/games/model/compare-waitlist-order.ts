type WaitlistMember = {
  waitlistedAt?: Date | string | null;
  drawRank?: number | null;
  joinedAt: Date | string;
};

// 대기 순서는 대기로 들어온 순서 하나다. 신청은 신청 시각, 추첨은 추첨 적용 시각과 순위, GM이 내리면 내린 시각.
export function compareWaitlistOrder(left: WaitlistMember, right: WaitlistMember): number {
  const time = (moment: Date | string) => new Date(moment).getTime();
  const enteredGap =
    time(left.waitlistedAt ?? left.joinedAt) - time(right.waitlistedAt ?? right.joinedAt);
  if (enteredGap !== 0) return enteredGap;
  const leftRank = left.drawRank ?? Number.POSITIVE_INFINITY;
  const rightRank = right.drawRank ?? Number.POSITIVE_INFINITY;
  if (leftRank !== rightRank) return leftRank < rightRank ? -1 : 1;
  return time(left.joinedAt) - time(right.joinedAt);
}
