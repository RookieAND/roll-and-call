import { RECRUIT_METHOD } from "@/entities/game";

// 모집 방식 카드의 취소 조건 줄. 마감이 지나면 판정이 끝났으므로 지운다.
export function minPlayersLine({
  minPlayers,
  endDate,
  now,
  recruitMethod,
}: {
  minPlayers: number | null;
  endDate: Date;
  now: Date;
  recruitMethod: string;
}): string | null {
  if (minPlayers === null || endDate.getTime() <= now.getTime()) return null;
  const subject = recruitMethod === RECRUIT_METHOD.lottery ? "추첨 전 신청자가" : "확정 참여자가";
  return `마감 때 ${subject} ${minPlayers}명 미만이면 모집이 취소됩니다.`;
}
