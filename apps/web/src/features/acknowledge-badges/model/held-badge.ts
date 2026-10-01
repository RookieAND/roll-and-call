import type { BadgeView } from "@/entities/badge";
import type { BadgeRecord } from "@/shared/server";

export type HeldBadge = BadgeView & { record: BadgeRecord };
