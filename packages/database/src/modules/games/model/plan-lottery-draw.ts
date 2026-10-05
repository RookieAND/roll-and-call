import { sortBy } from "es-toolkit";

import { countOpenLotterySeats } from "./count-open-lottery-seats";

type RolledApplicant = { userId: string; roll: number };

export type PlannedDrawEntry = RolledApplicant & { rank: number };

// 값이 낮은 순으로 남은 자리만큼 확정하고 나머지는 대기로 둔다. 신청자가 남은 자리 이하이면 모두 확정이다.
export function planLotteryDraw({
  applicants,
  confirmedCount,
  maxPlayers,
}: {
  applicants: RolledApplicant[];
  confirmedCount: number;
  maxPlayers: number;
}): { confirmed: PlannedDrawEntry[]; waiting: PlannedDrawEntry[] } {
  const openSeats = countOpenLotterySeats({ maxPlayers, confirmedCount });
  const ranked = sortBy(applicants, ["roll"]).map((applicant, index) => ({
    ...applicant,
    rank: index + 1,
  }));
  return { confirmed: ranked.slice(0, openSeats), waiting: ranked.slice(openSeats) };
}
