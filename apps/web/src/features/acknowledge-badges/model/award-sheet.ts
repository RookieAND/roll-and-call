import type { BadgeLook } from "@roll-and-call/database/rules";

import type { BadgeTone } from "@/entities/badge";

export type AwardItem = {
  key: string;
  emoji: string;
  look: BadgeLook;
  name: string;
  ribbon: string | null;
  tag: string;
  tagTone: BadgeTone;
  requirement: string;
};

// 첫 뱃지·이달의 뱃지·하나만 받음 = single, 여러 개 = multi, 출시 직후 처음 받은 묶음 = retro.
export type AwardSheet =
  | {
      kind: "single";
      item: AwardItem;
      lines: string[];
      source: { label: string; href: string } | null;
      gold: boolean;
      pinnable: boolean;
    }
  | { kind: "multi"; items: AwardItem[]; subtitle: string | null }
  | { kind: "retro"; items: AwardItem[] };
