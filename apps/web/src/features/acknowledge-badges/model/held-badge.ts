import type { BadgeRecord } from "@roll-and-call/database/badges";

import type { BadgeView } from "@/entities/badge";

export type HeldBadge = BadgeView & { record: BadgeRecord };
