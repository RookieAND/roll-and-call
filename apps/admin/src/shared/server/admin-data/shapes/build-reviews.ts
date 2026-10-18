import type { ReviewAuthorRole } from "@roll-and-call/database/games/model";
import { CONTENT_REASON, reasonLabel } from "@roll-and-call/database/moderation/model";
import { isNull } from "es-toolkit";

import type { Review } from "../types";
import type { ShapeContext } from "./shape-context";

export function buildReviews({ tables, nicknameOf }: ShapeContext): Review[] {
  const absentKeys = new Set(
    tables.participantRows
      .filter((row) => row.absent && isNull(row.absenceCancelledAt))
      .map((row) => `${row.gameId}:${row.userId}`),
  );
  return tables.reviewRows.map((row) => ({
    id: row.id,
    sessionId: row.gameId,
    authorId: row.authorId,
    authorRole: row.authorRole as ReviewAuthorRole,
    body: row.body,
    spoiler: row.spoiler,
    photoUrls: row.photoUrls,
    createdAt: row.createdAt,
    editedAt: row.updatedAt ?? undefined,
    hidden: row.hiddenAt
      ? {
          reason: reasonLabel({
            code: row.hiddenReasonCode,
            text: row.hiddenReasonText,
            reasons: CONTENT_REASON,
          }),
          by: nicknameOf(row.hiddenBy),
          at: row.hiddenAt,
        }
      : undefined,
    removed: row.removedAt
      ? {
          reason: reasonLabel({
            code: row.removedReasonCode,
            text: row.removedReasonText,
            reasons: CONTENT_REASON,
          }),
          by: nicknameOf(row.removedBy),
          at: row.removedAt,
        }
      : undefined,
    held: absentKeys.has(`${row.gameId}:${row.authorId}`),
  }));
}
