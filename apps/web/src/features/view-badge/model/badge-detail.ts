import type { BadgeGrade } from "@roll-and-call/database/rules";

import type { BadgeTone } from "@/entities/badge";

export type BadgeDetailMedal = {
  emoji: string;
  grade: BadgeGrade;
  locked: boolean;
  ribbon: string | null;
};

// 상세 시트 한 장. 서버에서 문구까지 만들어 넘긴다.
export type BadgeDetail = {
  name: string;
  medal: BadgeDetailMedal;
  tierLabel: string;
  tierTone: BadgeTone;
  condition: string;
  earned: {
    dateLabel: string;
    source: { heading: string; label: string; href: string | null } | null;
  } | null;
  progress: { label: string; countLabel: string; value: number; max: number } | null;
  stepsTitle: string;
  steps: {
    key: string;
    medal: BadgeDetailMedal;
    name: string;
    caption: string;
    status: string;
    statusTone: BadgeTone;
    current: boolean;
  }[];
};
