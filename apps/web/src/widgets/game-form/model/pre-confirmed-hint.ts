import { RECRUIT_METHOD, type RecruitMethod } from "@/entities/game";

import { countPeople } from "./count-people";

export function preConfirmedHint({
  count,
  openSeats,
  method,
}: {
  count: number;
  openSeats: number;
  method: RecruitMethod;
}) {
  if (count === 0) return "신청을 받지 않고 바로 함께할 사람이 있으면 넣어 주세요.";
  if (method === RECRUIT_METHOD.lottery) {
    return `직접 확정한 ${countPeople(count)}은 추첨에서 빠지고, 남은 ${openSeats}자리를 두고 추첨합니다.`;
  }
  if (method === RECRUIT_METHOD.selection) {
    return `직접 확정한 ${countPeople(count)}은 선발 없이 먼저 확정되고, 남은 ${openSeats}자리를 선발합니다.`;
  }
  return `구인을 올리면 ${countPeople(count)}이 바로 확정되고, 남은 ${openSeats}자리로 공개 모집합니다.`;
}
