"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { isSessionLocked, PARTICIPANT_STATUS } from "@/entities/game";
import {
  db,
  games,
  participants,
  type Game,
  notifyGameJoined,
  notifyRecruitmentComplete,
  refreshRecruitPost,
  getCurrentUser,
} from "@/shared/server";
import type { ActionResult } from "@/shared/api";
// waiting: 정원 초과로 대기 접수됐는지. 화면 표시 시점과 달리 실제 결과라 토스트 문구는 이걸 따른다.
export async function joinGame(gameId: string): Promise<ActionResult & { waiting?: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { error: "로그인이 필요합니다." };

  let becameFull = false;
  let joinedGame: Game | undefined;
  let joinedWaiting = false;
  let confirmedAfter = 0;

  // ponytail: lock the game row so concurrent joins to the same game serialize
  // and can't overfill the last slot. Per-game throughput is tiny, so a row lock is plenty.
  const result: ActionResult = await db.transaction(async (tx) => {
    const [game] = await tx.select().from(games).where(eq(games.id, gameId)).for("update");

    if (!game) return { error: "존재하지 않는 게임입니다." };
    if (game.gmId === user.id) {
      return { error: "GM은 참여자로 참여할 수 없습니다." };
    }
    // 일시 지정형은 등록 때부터 confirmedAt이 있으므로, 확정 여부는 isSessionLocked로 본다.
    if (isSessionLocked(game)) return { error: "이미 일정이 확정된 게임입니다." };
    if (game.endDate.getTime() <= Date.now()) {
      return { error: "모집이 마감되었습니다." };
    }

    // 정원까지는 confirmed, 초과분은 waiting(대기열)으로 받는다 — 거절하지 않는다.
    const confirmedCount = await tx.$count(
      participants,
      and(eq(participants.gameId, gameId), eq(participants.status, PARTICIPANT_STATUS.confirmed)),
    );
    const status =
      confirmedCount < game.maxPlayers ? PARTICIPANT_STATUS.confirmed : PARTICIPANT_STATUS.waiting;

    const inserted = await tx
      .insert(participants)
      .values({ gameId, userId: user.id, status })
      .onConflictDoNothing()
      .returning({ userId: participants.userId });

    if (inserted.length === 0) return { error: "이미 참여 중입니다." };

    joinedGame = game;
    joinedWaiting = status === PARTICIPANT_STATUS.waiting;
    confirmedAfter = status === PARTICIPANT_STATUS.confirmed ? confirmedCount + 1 : confirmedCount;
    // 이번 참여로 확정 정원이 막 찼을 때만 구인 완료를 알린다.
    becameFull = status === PARTICIPANT_STATUS.confirmed && confirmedCount + 1 === game.maxPlayers;
    return {};
  });

  if (result.error) return result;

  // 참여·대기 등록은 항상 스레드에, 정원이 막 찼으면 마감 채널에도 알린다.
  if (joinedGame) await announceNewApplication(joinedGame, user.id, joinedWaiting, confirmedAfter);
  if (becameFull) await announceRecruitmentComplete(gameId);
  await refreshRecruitPost(gameId);

  revalidatePath(`/games/${gameId}`);
  revalidatePath(`/games/${gameId}/participants`);
  revalidatePath("/games");
  return { waiting: joinedWaiting };
}

async function announceRecruitmentComplete(gameId: string) {
  const game = await db.query.games.findFirst({
    where: (g, { eq: eqOp }) => eqOp(g.id, gameId),
    with: {
      gm: { columns: { discordId: true, username: true } },
      participants: { with: { user: { columns: { discordId: true } } } },
    },
  });
  if (!game) return;

  const mentionIds = [
    game.gm?.discordId,
    ...game.participants.map((p) => p.user?.discordId),
  ].filter((id): id is string => Boolean(id));

  await notifyRecruitmentComplete(game, game.gm?.username ?? "?", mentionIds);
}

async function announceNewApplication(
  game: Game,
  applicantId: string,
  isWaiting: boolean,
  confirmedCount: number,
) {
  const [applicant, gm] = await Promise.all([
    db.query.profiles.findFirst({
      where: (p, { eq: eqOp }) => eqOp(p.id, applicantId),
      columns: { username: true },
    }),
    db.query.profiles.findFirst({
      where: (p, { eq: eqOp }) => eqOp(p.id, game.gmId),
      columns: { username: true },
    }),
  ]);
  await notifyGameJoined(game, {
    applicantName: applicant?.username ?? "?",
    gmName: gm?.username ?? "?",
    confirmedCount,
    isWaiting,
  });
}
