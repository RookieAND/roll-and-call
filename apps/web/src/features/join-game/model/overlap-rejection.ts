export const OVERLAP_REASON = "OVERLAP";

export const OVERLAP_MESSAGE =
  "같은 시간에 참여·신청 중이거나 진행하는 다른 세션이 있어 신청할 수 없습니다.";

// 겹치는 세션 하나만 알린다. 제목·GM 같은 다른 사람의 구인 정보는 담지 않는다.
export type OverlapRejection = {
  error: string;
  reason: typeof OVERLAP_REASON;
  overlapGameId: string;
};
