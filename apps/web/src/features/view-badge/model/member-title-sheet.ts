import type { BadgeLook } from "@roll-and-call/database/badges/model";

import type { BadgeDetail } from "./badge-detail";

export type MemberTitleSheet = {
  emoji: string;
  name: string;
  look: BadgeLook;
  detail: BadgeDetail;
};
