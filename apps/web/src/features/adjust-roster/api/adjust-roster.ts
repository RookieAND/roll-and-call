"use server";

import { and, asc, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { isSessionLocked, PARTICIPANT_STATUS, type ParticipantStatus } from "@/entities/game";
import {
  db,
  games,
  participants,
  getCurrentUser,
  notifyGameLeft,
  refreshRecruitPost,
} from "@/shared/server";
import type { ActionResult } from "@/shared/api";
const { confirmed, waiting } = PARTICIPANT_STATUS;

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
type Game = typeof games.$inferSelect;
export type RosterEntry = { userId: string; status: ParticipantStatus };

// 명단 변경을 거부할 때는 throw로 트랜잭션을 되돌리고, 그 문구를 결과로 돌려준다.
class RosterError extends Error {}

function revalidate(gameId: string) {
  revalidatePath(`/games/${gameId}/participants`);
  revalidatePath(`/games/${gameId}`);
  revalidatePath("/games");
}

// 모든 명단 조정이 거치는 한 길: GM 본인 · 세션 잠기기 전을 확인하고 트랜잭션 안에서 고친다.
// 성공하면 화면을 갱신하고(after가 있으면 먼저 실행) 디스코드 공지 인원을 고친다.
async function adjustRoster(
  gameId: string,
  work: (tx: Tx, game: Game) => Promise<void>,
  after?: () => Promise<void>,
): Promise<ActionResult> {
  const gmId = (await getCurrentUser())?.id;
  if (!gmId) return { error: "로그인이 필요합니다." };

  try {
    await db.transaction(async (tx) => {
      const [game] = await tx.select().from(games).where(eq(games.id, gameId)).for("update");
      if (!game) throw new RosterError("존재하지 않는 게임입니다.");
      if (game.gmId !== gmId) throw new RosterError("권한이 없습니다.");
      if (isSessionLocked(game)) throw new RosterError("이미 확정된 게임입니다.");
      await work(tx, game);
    });
  } catch (error) {
    if (error instanceof RosterError) return { error: error.message };
    throw error;
  }

  revalidate(gameId);
  await after?.();
  await refreshRecruitPost(gameId);
  return {};
}

async function statusOf(tx: Tx, gameId: string, userId: string) {
  const [row] = await tx
    .select({ status: participants.status })
    .from(participants)
    .where(and(eq(participants.gameId, gameId), eq(participants.userId, userId)));
  return row?.status ?? null;
}

async function setStatus(tx: Tx, gameId: string, userId: string, status: ParticipantStatus) {
  await tx
    .update(participants)
    .set({ status })
    .where(and(eq(participants.gameId, gameId), eq(participants.userId, userId)));
}

// 대기 → 확정 승격. 확정 정원이 이미 찼으면 가장 늦게 신청한 확정자를 대기로 밀어낸다.
// (화면은 정원이 차면 승격 대신 "교체"를 쓰므로 이 연쇄는 경합 때만 일어난다.)
export async function promoteParticipant(gameId: string, userId: string): Promise<ActionResult> {
  return adjustRoster(gameId, async (tx, game) => {
    const status = await statusOf(tx, gameId, userId);
    if (!status) throw new RosterError("참여자를 찾을 수 없습니다.");
    if (status === confirmed) return;

    const confirmedCount = await tx.$count(
      participants,
      and(eq(participants.gameId, gameId), eq(participants.status, confirmed)),
    );
    if (confirmedCount >= game.maxPlayers) {
      const [last] = await tx
        .select({ userId: participants.userId })
        .from(participants)
        .where(and(eq(participants.gameId, gameId), eq(participants.status, confirmed)))
        .orderBy(desc(participants.joinedAt))
        .limit(1);
      if (last) await setStatus(tx, gameId, last.userId, waiting);
    }
    await setStatus(tx, gameId, userId, confirmed);
  });
}

// 확정 → 대기 강등. 빈 확정 자리는 대기열 맨 앞(가장 먼저 신청한 대기자)이 자동으로 채운다.
export async function demoteParticipant(gameId: string, userId: string): Promise<ActionResult> {
  return adjustRoster(gameId, async (tx) => {
    const status = await statusOf(tx, gameId, userId);
    if (!status) throw new RosterError("참여자를 찾을 수 없습니다.");
    if (status === waiting) return;
    await setStatus(tx, gameId, userId, waiting);
    await promoteWaitlistHead(tx, gameId, userId);
  });
}

// 교체: 정원이 찬 상태에서 대기자 한 명을 올리고, GM이 고른 확정자 한 명을 대기로 내린다. 한 번에 실행된다.
export async function swapParticipants(
  gameId: string,
  promoteUserId: string,
  demoteUserId: string,
): Promise<ActionResult> {
  return adjustRoster(gameId, async (tx) => {
    const incoming = await statusOf(tx, gameId, promoteUserId);
    const outgoing = await statusOf(tx, gameId, demoteUserId);
    if (incoming !== waiting || outgoing !== confirmed) {
      throw new RosterError("명단이 바뀌었습니다. 새로고침 후 다시 시도하세요.");
    }
    await setStatus(tx, gameId, demoteUserId, waiting);
    await setStatus(tx, gameId, promoteUserId, confirmed);
  });
}

// 되돌리기 전용: 방금 바꾼 사람들의 상태를 그대로 되돌린다. "대기 맨 앞이 채운다" 연쇄는 다시 적용하지 않는다.
export async function restoreRoster(gameId: string, entries: RosterEntry[]): Promise<ActionResult> {
  const valid = entries.every((e) => e.status === confirmed || e.status === waiting);
  if (!valid || entries.length === 0) return { error: "되돌릴 수 없는 요청입니다." };

  return adjustRoster(gameId, async (tx) => {
    for (const entry of entries) {
      if (!(await statusOf(tx, gameId, entry.userId))) {
        throw new RosterError("명단이 바뀌어 되돌릴 수 없습니다.");
      }
    }
    for (const entry of entries) await setStatus(tx, gameId, entry.userId, entry.status);
  });
}

// GM이 참여자를 내보낸다. 확정자였다면 대기열 맨 앞이 빈 자리를 채운다.
export async function removeParticipant(gameId: string, userId: string): Promise<ActionResult> {
  return adjustRoster(
    gameId,
    async (tx) => {
      const [removed] = await tx
        .delete(participants)
        .where(and(eq(participants.gameId, gameId), eq(participants.userId, userId)))
        .returning({ status: participants.status });
      if (!removed) throw new RosterError("참여자를 찾을 수 없습니다.");
      if (removed.status === confirmed) await promoteWaitlistHead(tx, gameId, userId);
    },
    () => notifyGameLeft(gameId, userId, true),
  );
}

// 대기열 맨 앞(target 제외)을 확정으로 올린다. 대기자가 없으면 아무것도 하지 않는다.
async function promoteWaitlistHead(tx: Tx, gameId: string, excludeUserId: string) {
  const head = await tx
    .select({ userId: participants.userId })
    .from(participants)
    .where(and(eq(participants.gameId, gameId), eq(participants.status, waiting)))
    .orderBy(asc(participants.joinedAt));
  const next = head.find((h) => h.userId !== excludeUserId);
  if (next) await setStatus(tx, gameId, next.userId, confirmed);
}
