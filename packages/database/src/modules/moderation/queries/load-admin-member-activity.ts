import { and, eq, inArray, or } from "drizzle-orm";
import { compact, uniq } from "es-toolkit";

import { db } from "#db/client";
import {
  certApplications,
  games,
  participants,
  profiles,
  rulebookQuizQuestions,
  rulebooks,
} from "#db/schema";

import { ADMIN_TABLE_LOADERS } from "./load-admin-tables";

// ⌘K 유저 결과용 어드민 표. 이 사람들이 GM이거나 신청한 구인(명단 전체 포함)과 이들의 인증 신청만 읽고,
// 룰북·퀴즈 문항·닉네임은 그 행이 가리키는 것만 읽는다. 표 모양은 loadAdminTable과 같다.
export async function loadAdminMemberActivity({
  serverId,
  userIds,
}: {
  serverId: string;
  userIds: readonly string[];
}) {
  const gameRows = await ADMIN_TABLE_LOADERS.gameRows(
    serverId,
    or(
      inArray(games.gmId, userIds),
      inArray(
        games.id,
        db
          .select({ id: participants.gameId })
          .from(participants)
          .where(and(eq(participants.serverId, serverId), inArray(participants.userId, userIds))),
      ),
    ),
  );
  const gameIds = gameRows.map((game) => game.id);
  const participantRows = gameIds.length
    ? await ADMIN_TABLE_LOADERS.participantRows(serverId, inArray(participants.gameId, gameIds))
    : [];
  const applicationRows = await ADMIN_TABLE_LOADERS.applicationRows(
    serverId,
    inArray(certApplications.userId, userIds),
  );
  const quizIds = uniq(compact(applicationRows.map((row) => row.quizQuestionId)));
  const quizRows = quizIds.length
    ? await ADMIN_TABLE_LOADERS.quizRows(serverId, inArray(rulebookQuizQuestions.id, quizIds))
    : [];
  const rulebookIds = uniq(
    compact([
      ...gameRows.map((game) => game.rulebookId),
      ...applicationRows.map((row) => row.rulebookId),
    ]),
  );
  const rulebookRows = rulebookIds.length
    ? await ADMIN_TABLE_LOADERS.rulebookRows(serverId, inArray(rulebooks.id, rulebookIds))
    : [];
  const profileIds = uniq(
    compact([
      ...userIds,
      ...gameRows.flatMap((game) => [game.gmId, game.hiddenBy]),
      ...participantRows.flatMap((row) => [row.absenceCancelledBy, row.absenceAddedBy]),
      ...applicationRows.map((row) => row.processedBy),
      ...rulebookRows.map((rulebook) => rulebook.homebrewMakerId),
    ]),
  );
  const profileRows = await ADMIN_TABLE_LOADERS.profileRows(
    serverId,
    inArray(profiles.id, profileIds),
  );
  return { gameRows, participantRows, applicationRows, quizRows, rulebookRows, profileRows };
}
