import { RECRUIT_METHOD } from "@/entities/game";

import type { toGameColumns } from "./to-game-columns";

// 비공개 구인은 모집 방식·최소 인원·신청글·대기 접수를 쓰지 않아 고정값으로 덮는다. 모집 마감은 세션 시작과 같다.
export function toPrivateColumns(columns: ReturnType<typeof toGameColumns>) {
  return {
    ...columns,
    recruitMethod: RECRUIT_METHOD.firstCome,
    minPlayers: null,
    applicationNoteEnabled: false,
    waitlistEnabled: false,
    endDate: columns.confirmedAt ?? columns.endDate,
  };
}
