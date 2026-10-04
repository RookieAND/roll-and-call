export const SEATS_NOTICE = {
  full: "full",
  raisable: "raisable",
  raised: "raised",
} as const;

export type SeatsNotice = (typeof SEATS_NOTICE)[keyof typeof SEATS_NOTICE];

// 정원이 찼을 때 참여자 찾기 시트 위에 띄울 안내. 세션 시작 뒤에는 한 번만 1명 늘려 넣을 수 있다.
export function seatsNotice({
  openSeats,
  started,
  capacityRaised,
}: {
  openSeats: number;
  started: boolean;
  capacityRaised: boolean;
}): SeatsNotice | null {
  if (openSeats > 0) return null;
  if (!started) return SEATS_NOTICE.full;
  return capacityRaised ? SEATS_NOTICE.raised : SEATS_NOTICE.raisable;
}
