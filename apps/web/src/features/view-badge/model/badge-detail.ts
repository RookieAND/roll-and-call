import type { BadgeLook } from "@roll-and-call/database/badges/model";

import type { BadgeTone } from "@/entities/badge";

export type BadgeDetailMedal = {
  emoji: string;
  look: BadgeLook;
  locked: boolean;
  ribbon: string | null;
};

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
