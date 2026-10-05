import { BADGE_ROLE, type BadgeRole } from "@roll-and-call/database/badges/model";
import { groupBy } from "es-toolkit";

import type { FeaturedChoice } from "./featured-choice";
import { FEATURED_GROUP_META, SPECIAL_GROUP_KEY } from "./featured-group-meta";

const GROUP_ORDER = Object.keys(FEATURED_GROUP_META);

export function groupChoices({ choices, role }: { choices: FeaturedChoice[]; role: BadgeRole }) {
  const grouped: Record<string, FeaturedChoice[] | undefined> = groupBy(
    choices.filter((choice) => choice.role === role),
    (choice) => (role === BADGE_ROLE.special ? SPECIAL_GROUP_KEY : choice.ladder),
  );
  return GROUP_ORDER.filter((key) => grouped[key]).map((key) => ({
    key,
    ...FEATURED_GROUP_META[key]!,
    choices: grouped[key]!,
  }));
}
