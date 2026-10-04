import type { BadgeLook } from "@roll-and-call/database/badges/model";

export const AWARD_SHEET_KIND = { retro: "retro", hidden: "hidden", first: "first" } as const;

export type AwardItem = {
  key: string;
  emoji: string;
  look: BadgeLook;
  name: string;
  ribbon: string | null;
};

export type AwardHighlight = AwardItem & {
  line: string;
  source: { label: string; href: string } | null;
};

// 출시 직후 지난 기록으로 채운 묶음 = retro, 숨겨진 칭호 = hidden, 첫 뱃지(누적 1단계) = first. 함께 받은 나머지는 chips.
export type AwardSheet =
  | { kind: typeof AWARD_SHEET_KIND.retro; items: AwardItem[] }
  | {
      kind: typeof AWARD_SHEET_KIND.hidden | typeof AWARD_SHEET_KIND.first;
      highlights: AwardHighlight[];
      chips: AwardItem[];
    };
