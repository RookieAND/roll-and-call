import type { Game } from "@roll-and-call/database";
import {
  cancelBlockReason,
  compareWaitlistOrder,
  formatPlayRange,
  gameCancelledRecipients,
  isAutoConfirmedAttendance,
  isSessionStarted,
  RECRUIT_METHOD_LABEL,
  sessionEndAt,
} from "@roll-and-call/database/games/model";
import { CONTENT_REASON, reasonLabel } from "@roll-and-call/database/moderation/model";
import { GAME_CANCEL_KIND } from "@roll-and-call/database/notifications/model";
import { groupBy, isNull } from "es-toolkit";

import { gameStatus, plainText } from "@/shared/lib";

import { gameStartsAt } from "../game-starts-at";
import type { Session } from "../types";
import type { ShapeContext } from "./shape-context";

export function buildSessions({
  tables,
  now,
  nicknameOf,
  rulebookLabelOf,
}: ShapeContext): Session[] {
  const gameRulebook = (game: Game) =>
    (game.rulebookId && rulebookLabelOf(game.rulebookId)) || game.rule;
  const rosterOf = groupBy(tables.participantRows, (row) => row.gameId);
  return tables.gameRows.map((game) => {
    const roster = (rosterOf[game.id] ?? []).toSorted(
      (a, b) =>
        (a.drawRank ?? Infinity) - (b.drawRank ?? Infinity) ||
        a.joinedAt.getTime() - b.joinedAt.getTime(),
    );
    const confirmedJoins = roster
      .filter((row) => row.status === "confirmed")
      .map((row) => row.joinedAt)
      .toSorted((a, b) => a.getTime() - b.getTime());
    return {
      id: game.id,
      title: game.title,
      rulebook: gameRulebook(game),
      rulebookId: game.rulebookId,
      gmId: game.gmId,
      startsAt: gameStartsAt(game),
      timeFixed: !isNull(game.confirmedAt),
      memberIds: roster.filter((row) => row.status === "confirmed").map((row) => row.userId),
      waitingIds: roster
        .filter((row) => row.status === "waiting")
        .toSorted(compareWaitlistOrder)
        .map((row) => row.userId),
      capacity: game.maxPlayers,
      closed: game.endDate.getTime() <= now,
      recruitStatus: gameStatus(game, now),
      createdAt: game.createdAt,
      filledAt: confirmedJoins[game.maxPlayers - 1],
      recruitMethod: RECRUIT_METHOD_LABEL[game.recruitMethod],
      recruitDeadline: game.endDate,
      playTime: formatPlayRange(game.playMinutesMin, game.playMinutes) ?? undefined,
      genres: game.genres,
      triggers: game.triggers,
      platforms: game.platforms,
      aiImage: game.aiImage,
      kindLabel: game.kind === "briefing" ? "설명회" : "세션",
      playTypeLabel: game.playType === "text" ? "텍스트" : "보이스",
      joinedAt: new Map(roster.map((row) => [row.userId, row.joinedAt])),
      applicationNoteEnabled: game.applicationNoteEnabled,
      minRulePlays: game.minRulePlays,
      requireRulebookCert: game.requireRulebookCert,
      applicationNoteUserIds: new Set(
        roster.filter((row) => row.hasApplicationNote).map((row) => row.userId),
      ),
      synopsis: game.synopsis ? plainText(game.synopsis) : undefined,
      notices: game.notice
        ? plainText(game.notice)
            .split("\n")
            .filter((line) => line.trim())
        : [],
      imageUrls: game.images,
      thumbnailUrl: game.thumbnailUrl ?? undefined,
      attendanceConfirmedAt: game.attendanceConfirmedAt ?? undefined,
      attendanceFirstConfirmedAt: game.attendanceFirstConfirmedAt ?? undefined,
      attendanceAutoConfirmed: isAutoConfirmedAttendance(game),
      hidden: game.hiddenAt
        ? {
            reason: reasonLabel({
              code: game.hiddenReasonCode,
              text: game.hiddenReasonText,
              reasons: CONTENT_REASON,
            }),
            by: nicknameOf(game.hiddenBy),
            at: game.hiddenAt,
          }
        : undefined,
      cancelled: !isNull(game.cancelledAt),
      cancelBlock: cancelBlockReason({ game, now: new Date(now) }),
      sessionStarted: isSessionStarted(game, new Date(now)),
      staffCancelRecipientIds: gameCancelledRecipients({
        game,
        kind: GAME_CANCEL_KIND.staff,
        roster,
      }),
      endsAt: sessionEndAt(game),
    };
  });
}
