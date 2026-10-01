import type { BadgeLook } from "@roll-and-call/database/badges/model";

import type { BadgeDetail } from "@/features/view-badge";

export type DexMedal = {
  key: string;
  emoji: string;
  look: BadgeLook;
  locked: boolean;
  isNew: boolean;
  name: string;
  caption: string;
  detail: BadgeDetail;
};
