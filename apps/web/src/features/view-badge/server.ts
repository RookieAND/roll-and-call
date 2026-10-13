import "server-only";
import { loadRepresentativeBadges } from "@/entities/badge/server";

import { heldBadgeDetail } from "./model/held-badge-detail";
import type { MemberTitleSheet } from "./model/member-title-sheet";

interface LoadMemberTitleSheetsParams {
  serverId: string;
  userIds: string[];
  now: Date;
}

export async function loadMemberTitleSheets({
  serverId,
  userIds,
  now,
}: LoadMemberTitleSheetsParams): Promise<Record<string, MemberTitleSheet>> {
  const entries = await loadRepresentativeBadges({ serverId, userIds, now });
  return Object.fromEntries(
    entries.map(({ userId, badge, records }) => [
      userId,
      {
        emoji: badge.emoji,
        name: badge.name,
        look: badge.look,
        detail: heldBadgeDetail({ badge, records, facts: null, now }),
      },
    ]),
  );
}
