"use server";

import { getRulebookRecords } from "@roll-and-call/database/certifications";
import {
  createGameWithRoster,
  deleteParticipant,
  listWaitingParticipants,
  lockGame,
} from "@roll-and-call/database/games";
import { listSanctionedUserIds } from "@roll-and-call/database/moderation";
import { createNotifications } from "@roll-and-call/database/notifications";
import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";
import { withTransaction } from "@roll-and-call/database/transaction";
import { uniq } from "es-toolkit";
import { revalidatePath } from "next/cache";

import { isSessionStarted } from "@/entities/game";
import { RULE_GATE, ruleGate, ruleSetOf, toMyRulebooks } from "@/entities/rulebook";
import {
  AppError,
  ERROR_DISPLAY,
  GAME_CANCELLED_MESSAGE,
  GAME_NOT_FOUND_MESSAGE,
  parseActionInput,
  type ActionResult,
} from "@/shared/api";
import { serverPath } from "@/shared/lib";
import { getActingMember, notMemberError } from "@/shared/server";

import { splitTeamsBlock } from "../model/split-teams-block";
import { splitTeamsColumns } from "../model/split-teams-columns";
import { splitTeamsInputSchema, type SplitTeamsInput } from "../model/split-teams-input";
import { splitTeamsSchedule } from "../model/split-teams-schedule";

// 원 구인의 대기자(판정 전에는 신청자) 가운데 GM이 고른 사람으로 지정 모집 구인을 새로 연다.
// 고른 사람은 원 구인 명단에서 지우고(불참 기록 없음) 새 구인의 확정 참여자로 넣는다. 신청글은 이어받고 가능 시간은 넘기지 않는다.
// 지정 모집이라 디스코드 공지는 없다. 원 구인 모집 글은 확정 인원만 보여 줘 대기자를 빼도 고칠 것이 없다.
export async function splitTeams(
  input: SplitTeamsInput,
): Promise<ActionResult & { gameId?: string }> {
  const parsed = parseActionInput(splitTeamsInputSchema, input);
  if (!parsed.ok) return parsed.result;
  const { fromGameId, maxPlayers, schedule } = parsed.data;
  const userIds = uniq(parsed.data.userIds);

  const member = await getActingMember();
  if (!member) return { error: await notMemberError() };
  const { server, user } = member;
  const now = new Date();

  const scheduled = splitTeamsSchedule(schedule, now);
  if ("error" in scheduled) return { error: scheduled.error };

  let gameId: string;
  try {
    gameId = await withTransaction(async (transaction) => {
      const game = await lockGame({ transaction, serverId: server.id, gameId: fromGameId });
      if (!game) throw new AppError(GAME_NOT_FOUND_MESSAGE, ERROR_DISPLAY.page);
      if (game.gmId !== user.id) throw new AppError("권한이 없습니다.");
      if (game.cancelledAt) throw new AppError(GAME_CANCELLED_MESSAGE);
      if (isSessionStarted(game, now)) {
        throw new AppError("세션이 시작된 구인은 팀을 나눌 수 없습니다.");
      }

      const waiting = await listWaitingParticipants({
        transaction,
        serverId: server.id,
        gameId: game.id,
      });
      const sanctionedIds = await listSanctionedUserIds({
        executor: transaction,
        serverId: server.id,
        userIds: [user.id, ...userIds],
        now,
      });
      if (sanctionedIds.includes(user.id)) {
        throw new AppError("활동 정지 기간에는 구인을 열 수 없습니다.");
      }
      const block = splitTeamsBlock({
        userIds,
        capacity: maxPlayers,
        waitingIds: waiting.map((participant) => participant.userId),
        excludedIds: [
          ...sanctionedIds,
          ...waiting
            .filter((participant) => participant.departed)
            .map((participant) => participant.userId),
        ],
      });
      if (block) throw new AppError(block);

      // 원 구인의 룰은 사용 범위와 상관없이 찾는다. 자작 룰은 인증이 필요 없어 그대로 열리고, 일반 룰은 인증을 본다.
      const myRulebooks = toMyRulebooks(
        await getRulebookRecords({
          serverId: server.id,
          userId: user.id,
          includeRulebookId: game.rulebookId,
        }),
      );
      const set = game.rulebookId ? ruleSetOf({ myRulebooks, rulebookId: game.rulebookId }) : null;
      if (!set || ruleGate({ set, myRulebooks }).type === RULE_GATE.blocked) {
        throw new AppError("이 룰로는 지금 구인을 열 수 없습니다. 룰북 인증 상태를 확인해 주세요.");
      }

      const createdId = await createGameWithRoster({
        transaction,
        serverId: server.id,
        columns: splitTeamsColumns({ game, maxPlayers, schedule: scheduled.columns }),
        confirmedUserIds: userIds,
        applicationNotes: new Map(
          waiting.map((participant) => [participant.userId, participant.applicationNote]),
        ),
        now,
      });
      // 남은 대기 순서는 waitlistedAt·drawRank를 그대로 두어 바뀌지 않는다.
      for (const userId of userIds) {
        await deleteParticipant({ transaction, serverId: server.id, gameId: game.id, userId });
      }
      await createNotifications({
        executor: transaction,
        serverId: server.id,
        actorId: user.id,
        notifications: userIds.map((userId) => ({
          userId,
          kind: NOTIFICATION_KIND.newGameJoined,
          params: { gameId: createdId, gameTitle: game.title },
        })),
      });
      return createdId;
    });
  } catch (error) {
    if (error instanceof AppError) return { error: error.message, errorDisplay: error.display };
    throw error;
  }

  const gamePath = serverPath({ slug: server.slug, path: `/games/${fromGameId}` });
  revalidatePath(`${gamePath}/participants`);
  revalidatePath(gamePath);
  revalidatePath(`${gamePath}/draw`);
  revalidatePath(serverPath({ slug: server.slug, path: "/games" }));
  return { gameId };
}
