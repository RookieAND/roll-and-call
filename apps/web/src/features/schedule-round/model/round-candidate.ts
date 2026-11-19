import { roundSlotLabel } from "@/entities/game";

export interface RoundCandidate {
  // KST 입력 값(YYYY-MM-DDTHH:mm)
  startsAt: string;
  endsAt: string;
  line: string;
  conflictHint: string | null;
}

// 「10월 31일 (토) 오후 12:00~4:00 · 5명 모두 가능」
export function roundCandidateLine({
  startsAt,
  endsAt,
  memberCount,
  totalCount,
}: {
  startsAt: Date;
  endsAt: Date;
  memberCount: number;
  totalCount: number;
}) {
  const people = memberCount >= totalCount ? `${memberCount}명 모두 가능` : `${memberCount}명 가능`;
  return `${roundSlotLabel({ startsAt, endsAt })} · ${people}`;
}
