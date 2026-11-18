export const OVERLAP_REASON = "OVERLAP";

export const OVERLAP_MESSAGE =
  "같은 시간에 참여·신청 중이거나 진행하는 다른 세션이 있어 신청할 수 없습니다.";

// 겹친 상대 회차 하나. 신청하는 본인에게만 보이는 정보이고 날짜는 ISO 문자열로 실어 보낸다.
export type OverlapSlot = {
  targetRoundNo: number;
  gameTitle: string;
  // 상대 구인의 예정 회차 수. 1이면 단발이다.
  gameRoundCount: number;
  roundNo: number;
  startsAt: string;
  endsAt: string;
};

export type OverlapFields = {
  reason: typeof OVERLAP_REASON;
  // 「겹치는 세션 보기」가 여는 첫 상대 구인.
  overlapGameId: string;
  // 신청하려는 구인의 예정 회차 수.
  targetRoundCount: number;
  overlaps: OverlapSlot[];
};

// 안내 창이 그리는 값.
export type OverlapDetail = Pick<OverlapFields, "overlapGameId" | "targetRoundCount" | "overlaps">;

export type OverlapRejection = { error: string } & OverlapFields;
