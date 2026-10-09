import { BADGE_ROLE } from "@roll-and-call/database/badges/model";

import { isValueOf } from "@/shared/lib";

export const isBadgeRole = isValueOf(BADGE_ROLE);
