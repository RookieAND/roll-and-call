import { countPeople } from "./count-people";

export function preConfirmedHint({
  count,
  openSeats,
  isLottery,
}: {
  count: number;
  openSeats: number;
  isLottery: boolean;
}) {
  if (count === 0) return "신청을 받지 않고 바로 함께할 사람이 있으면 넣어 주세요.";
  if (isLottery) {
    return `직접 확정한 ${countPeople(count)}은 추첨에서 빠지고, 남은 ${openSeats}자리를 두고 추첨합니다.`;
  }
  return `구인을 올리면 ${countPeople(count)}이 바로 확정되고, 남은 ${openSeats}자리로 공개 모집합니다.`;
}
