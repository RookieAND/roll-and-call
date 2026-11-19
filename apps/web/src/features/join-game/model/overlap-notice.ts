import { roundSlotLabel } from "@/entities/game";

import type { OverlapSlot } from "./overlap-rejection";

export const OVERLAP_SINGLE_INTRO = "시간이 겹치는 다른 세션이 있어 신청할 수 없습니다.";
export const OVERLAP_CLOSING_LINE = "겹치는 세션을 확인한 뒤 다시 신청해 주세요.";

const VISIBLE_LINE_LIMIT = 3;

export type OverlapNotice = {
  intro: string;
  lines: string[];
  // 「외 2건」. 줄이 한도를 넘지 않으면 null이다.
  moreLabel: string | null;
};

function lineOf({ slot, isTargetMulti }: { slot: OverlapSlot; isTargetMulti: boolean }) {
  const when = roundSlotLabel({ startsAt: slot.startsAt, endsAt: slot.endsAt });
  if (isTargetMulti) return `${slot.targetRoundNo}회차 · ${when} ↔ ${slot.gameTitle}`;
  if (slot.gameRoundCount > 1) return `${slot.gameTitle} ${slot.roundNo}회차 · ${when}`;
  return `${slot.gameTitle} · ${when}`;
}

// 이중 신청 안내 창의 소개 줄과 겹치는 회차 줄.
//   신청하려는 구인이 다회차 「이 구인의 3회차가 다른 세션과 겹칩니다.」 / 「3회차 · 11월 21일 (토) 오후 12:00~4:00 ↔ 제목」
//   내 다른 구인이 다회차 「참여 중인 구인과 시간이 겹칩니다.」 / 「제목 7회차 · 11월 21일 (토) 오후 12:00~4:00」
//   둘 다 단발이면 줄 없이 지금 문구 그대로다.
export function overlapNotice({
  targetRoundCount,
  overlaps,
}: {
  targetRoundCount: number;
  overlaps: readonly OverlapSlot[];
}): OverlapNotice {
  const isTargetMulti = targetRoundCount > 1;
  const isOtherMulti = overlaps.some((slot) => slot.gameRoundCount > 1);
  if (!isTargetMulti && !isOtherMulti) {
    return { intro: OVERLAP_SINGLE_INTRO, lines: [], moreLabel: null };
  }
  const intro = isTargetMulti
    ? `이 구인의 ${[...new Set(overlaps.map((slot) => slot.targetRoundNo))].map((roundNo) => `${roundNo}회차`).join(", ")}가 다른 세션과 겹칩니다.`
    : "참여 중인 구인과 시간이 겹칩니다.";
  const lines = overlaps.map((slot) => lineOf({ slot, isTargetMulti }));
  const hidden = lines.length - VISIBLE_LINE_LIMIT;
  return {
    intro,
    lines: lines.slice(0, VISIBLE_LINE_LIMIT),
    moreLabel: hidden > 0 ? `외 ${hidden}건` : null,
  };
}
