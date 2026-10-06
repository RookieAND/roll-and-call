import { countMinPlayersPool } from "./count-min-players-pool";

// 신청자(직접 확정자 포함)가 최소 인원 미만이면 [지금 추첨하기]를 허용하지 않는다. 마감 전후가 같다.
export function canDrawLottery({
  minPlayers,
  confirmedCount,
  applicantCount,
}: {
  minPlayers: number | null;
  confirmedCount: number;
  applicantCount: number;
}) {
  return (
    minPlayers === null || countMinPlayersPool({ confirmedCount, applicantCount }) >= minPlayers
  );
}
