"use server";

import {
  createGameWithRoster,
  listWaitingParticipants,
  lockGame,
} from "@roll-and-call/database/games";
import { awaitingResultMethod, compareWaitlistOrder } from "@roll-and-call/database/games/model";
import { listSanctionedUserIds } from "@roll-and-call/database/moderation";
import { createNotifications } from "@roll-and-call/database/notifications";
import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";
import { withTransaction } from "@roll-and-call/database/transaction";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";

import { isSessionEnded, SCHEDULE_MODE } from "@/entities/game";
import { RULE_GATE, ruleGate, ruleSetOf, toMyRulebooks } from "@/entities/rulebook";
import {
  AppError,
  ERROR_DISPLAY,
  GAME_CANCELLED_MESSAGE,
  GAME_NOT_FOUND_MESSAGE,
  type ActionResult,
} from "@/shared/api";
import { serverPath } from "@/shared/lib";
import {
  announceGameOpened,
  getActingMember,
  getRulebookRecords,
  notMemberError,
} from "@/shared/server";

import { isNextRoundRangeValid } from "../model/is-next-round-range-valid";
import { isNextRoundStartValid } from "../model/is-next-round-start-valid";
import { nextRoundBaseDate } from "../model/next-round-base-date";
import { nextRoundColumns } from "../model/next-round-columns";
import { nextRoundDeadline } from "../model/next-round-deadline";
import { NEXT_ROUND_RANGE_MESSAGE, NEXT_ROUND_START_MESSAGE } from "../model/next-round-rules";
import { splitNextRoundRoster } from "../model/split-next-round-roster";

const DATE = /^\d{4}-\d{2}-\d{2}$/;

const inputSchema = z.object({
  fromGameId: z.uuid(),
  rangeStart: z.string().regex(DATE).optional(),
  rangeEnd: z.string().regex(DATE).optional(),
  startsAt: z.iso.datetime({ offset: true }).optional(),
});

// 다음 회차는 원 구인의 정보와 대기자를 넘겨 새 구인으로 연다. 원 구인과 그 명단은 바꾸지 않고, 가능 시간은 넘기지 않는다.
export async function openNextRound(input: z.input<typeof inputSchema>): Promise<ActionResult> {
  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) return { error: "다음 회차 일정을 다시 골라 주세요." };
  const { fromGameId, rangeStart, rangeEnd, startsAt } = parsed.data;

  const member = await getActingMember();
  if (!member) return { error: await notMemberError() };
  const { server, user } = member;
  const myRulebooks = toMyRulebooks(
    await getRulebookRecords({ serverId: server.id, userId: user.id }),
  );
  const now = new Date();

  let opened: { gameId: string; confirmedUserIds: string[]; maxPlayers: number };
  try {
    opened = await withTransaction(async (transaction) => {
      const game = await lockGame({ transaction, serverId: server.id, gameId: fromGameId });
      if (!game) throw new AppError(GAME_NOT_FOUND_MESSAGE, ERROR_DISPLAY.page);
      if (game.gmId !== user.id) throw new AppError("권한이 없습니다.");
      if (game.cancelledAt) throw new AppError(GAME_CANCELLED_MESSAGE);
      if (isSessionEnded(game, now)) throw new AppError("세션이 끝나 다음 회차를 열 수 없습니다.");
      const awaitingResult = awaitingResultMethod(game);
      if (awaitingResult) {
        throw new AppError(
          awaitingResult === "lottery"
            ? "추첨을 마친 뒤에 열 수 있습니다."
            : "선발을 마친 뒤에 열 수 있습니다.",
        );
      }

      const waiting = (
        await listWaitingParticipants({ transaction, serverId: server.id, gameId: game.id })
      ).toSorted(compareWaitlistOrder);
      const sanctionedIds = await listSanctionedUserIds({
        executor: transaction,
        serverId: server.id,
        userIds: [user.id, ...waiting.map((participant) => participant.userId)],
        now,
      });
      const roster = splitNextRoundRoster({
        orderedIds: waiting.map((participant) => participant.userId),
        excludedIds: [
          ...sanctionedIds,
          ...waiting
            .filter((participant) => participant.departed)
            .map((participant) => participant.userId),
        ],
        maxPlayers: game.maxPlayers,
      });
      if (roster.confirmed.length === 0) {
        throw new AppError("대기자가 없어 다음 회차를 열 수 없습니다.");
      }
      if (sanctionedIds.includes(user.id)) {
        throw new AppError("활동 정지 기간에는 구인을 열 수 없습니다.");
      }
      const set = game.rulebookId ? ruleSetOf({ myRulebooks, rulebookId: game.rulebookId }) : null;
      if (!set || ruleGate({ set, myRulebooks }).type === RULE_GATE.blocked) {
        throw new AppError("이 룰로는 지금 구인을 열 수 없습니다. 룰북 인증 상태를 확인해 주세요.");
      }

      const baseDate = nextRoundBaseDate({
        confirmedAt: game.confirmedAt,
        rangeEnd: game.rangeEnd,
        now,
      });
      const coordinate = game.scheduleMode === SCHEDULE_MODE.coordinate;
      const sessionStart = startsAt ? new Date(startsAt) : undefined;
      if (coordinate) {
        if (
          !rangeStart ||
          !rangeEnd ||
          !isNextRoundRangeValid({ baseDate, rangeStart, rangeEnd })
        ) {
          throw new AppError(NEXT_ROUND_RANGE_MESSAGE);
        }
      } else if (!sessionStart || !isNextRoundStartValid({ baseDate, startsAt: sessionStart })) {
        throw new AppError(NEXT_ROUND_START_MESSAGE);
      }
      const endDate = coordinate
        ? nextRoundDeadline({ rangeStart })
        : nextRoundDeadline({ startsAt: sessionStart });
      if (endDate.getTime() <= now.getTime()) {
        throw new AppError("모집 마감이 이미 지난 일정입니다. 날짜를 하루 뒤로 골라 주세요.");
      }

      const gameId = await createGameWithRoster({
        transaction,
        serverId: server.id,
        columns: nextRoundColumns({
          game,
          endDate,
          rangeStart: coordinate ? rangeStart! : null,
          rangeEnd: coordinate ? rangeEnd! : null,
          confirmedAt: coordinate ? null : sessionStart!,
        }),
        confirmedUserIds: roster.confirmed,
        waitingUserIds: roster.waiting,
        now,
      });
      await createNotifications({
        executor: transaction,
        serverId: server.id,
        actorId: user.id,
        notifications: roster.confirmed.map((userId) => ({
          userId,
          kind: NOTIFICATION_KIND.participationConfirmed,
          params: { gameId, gameTitle: game.title },
        })),
      });
      return { gameId, confirmedUserIds: roster.confirmed, maxPlayers: game.maxPlayers };
    });
  } catch (error) {
    if (error instanceof AppError) return { error: error.message, errorDisplay: error.display };
    throw error;
  }

  after(() => announceGameOpened({ server, ...opened }));
  redirect(serverPath({ slug: server.slug, path: `/games/${opened.gameId}` }));
}
