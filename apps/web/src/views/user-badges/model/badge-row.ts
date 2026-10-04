import type { BadgeLook } from "@roll-and-call/database/badges/model";

import type { BadgeDetail } from "@/features/view-badge";

export type BadgeRowGroup = {
  key: string;
  title: string;
  rows: {
    key: string;
    emoji: string;
    look: BadgeLook;
    name: string;
    requirement: string;
    note: string | null;
    dateLabel: string;
    detail: BadgeDetail;
  }[];
};
