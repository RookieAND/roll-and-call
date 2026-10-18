import { reasonLabel, USER_ACTION_REASON } from "@roll-and-call/database/moderation/model";
import { membershipOf } from "@roll-and-call/database/moderation/model";
import { groupBy, keyBy } from "es-toolkit";

import { gameStartsAt } from "../game-starts-at";
import type { AdminUser } from "../types";
import type { ShapeContext } from "./shape-context";

const DAY = 86_400_000;
const NINETY_DAYS = 90 * DAY;

export function buildUsers({ tables, now, nicknameOf }: ShapeContext): AdminUser[] {
  const handles = new Map(tables.handleRows.map((row) => [row.id, row.handle]));
  const hostedBy = groupBy(tables.gameRows, (game) => game.gmId);
  const sanctionOf = keyBy(tables.sanctionRows, (row) => row.userId);
  return tables.profileRows.map((profile) => {
    const hosted = hostedBy[profile.id] ?? [];
    const sanction = sanctionOf[profile.id];
    return {
      id: profile.id,
      nickname: profile.nickname,
      discordId: profile.discordId,
      discordHandle: handles.get(profile.id) ?? profile.username,
      joinedAt: profile.createdAt,
      memberJoinedAt: profile.memberJoinedAt,
      hostedCount: hosted.length,
      recentHostedCount: hosted.filter((game) => now - gameStartsAt(game).getTime() < NINETY_DAYS)
        .length,
      sanction: sanction
        ? {
            until: sanction.until,
            by: nicknameOf(sanction.createdBy),
            at: sanction.createdAt,
            reason: reasonLabel({
              code: sanction.reasonCode,
              text: sanction.reasonText,
              reasons: USER_ACTION_REASON,
            }),
          }
        : undefined,
      membership: membershipOf(profile),
      rejoinedAt: profile.rejoinedAt ?? undefined,
      leftAt: profile.leftAt ?? undefined,
      ban: profile.bannedAt
        ? {
            at: profile.bannedAt,
            by: nicknameOf(profile.bannedBy),
            reason: reasonLabel({
              code: profile.banReasonCode,
              text: profile.banReasonText,
              reasons: USER_ACTION_REASON,
            }),
          }
        : undefined,
    };
  });
}
