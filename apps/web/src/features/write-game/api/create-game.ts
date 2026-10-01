"use server";

import {
  createGameWithRoster,
  getGameWithGmName,
  saveDiscordThreadId,
} from "@roll-and-call/database/games";
import { countServerMembers } from "@roll-and-call/database/profiles";
import { uniq } from "es-toolkit";
import { redirect } from "next/navigation";
import { after } from "next/server";

import { RULE_GATE, ruleGate, ruleSetOf, toMyRulebooks } from "@/entities/rulebook";
import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import {
  announceRecruitmentComplete,
  getCurrentServer,
  getCurrentUser,
  getRulebookRecords,
  notifyDirectConfirmed,
  notifyGameCreated,
} from "@/shared/server";

import { gameFormSchema, INVALID_INPUT_MESSAGE, type GameFormValues } from "../model/game-form";
import { toGameColumns } from "../model/to-game-columns";

export async function createGame(input: GameFormValues): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const parsed = gameFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? INVALID_INPUT_MESSAGE };
  }

  // 룰은 카테고리·판본 단위다. 표시 이름은 "카테고리 판본", 구인은 그 판본의 첫 기본 룰북을 가리킨다.
  const server = await getCurrentServer();
  const myRulebooks = toMyRulebooks(
    await getRulebookRecords({ serverId: server.id, userId: user.id }),
  );
  const set = ruleSetOf({ myRulebooks, rulebookId: parsed.data.rulebookId });
  if (!set) return { error: "룰을 다시 골라 주세요.", field: "rule" };
  if (ruleGate({ set, myRulebooks }).type === RULE_GATE.blocked) {
    return {
      error: "그사이 인증 상태가 바뀌어 등록하지 못했습니다. 작성한 내용은 그대로 있습니다.",
      field: "rule",
    };
  }

  const invitedIds = uniq(parsed.data.preConfirmed.map((player) => player.userId));
  if (invitedIds.includes(user.id)) return { error: "GM은 참여자로 넣을 수 없습니다." };
  if (invitedIds.length > 0) {
    const found = await countServerMembers({ serverId: server.id, userIds: invitedIds });
    if (found !== invitedIds.length) {
      return { error: "찾을 수 없는 사람이 있습니다. 직접 확정할 사람을 다시 골라 주세요." };
    }
  }

  const gameId = await createGameWithRoster({
    serverId: server.id,
    columns: {
      gmId: user.id,
      rule: set.label,
      rulebookId: set.cores[0]!.id,
      ...toGameColumns(parsed.data),
    },
    confirmedUserIds: invitedIds,
  });

  const recruitmentComplete = invitedIds.length === Number(parsed.data.maxPlayers);
  after(async () => {
    const game = await getGameWithGmName({ serverId: server.id, gameId });
    const threadId =
      game &&
      (await notifyGameCreated({
        server,
        game,
        gmName: game.gm?.username ?? "?",
        confirmedCount: invitedIds.length,
      }));
    if (threadId) {
      await saveDiscordThreadId({ serverId: server.id, gameId, threadId });
      await notifyDirectConfirmed({ server, gameId, userIds: invitedIds });
    }
    if (recruitmentComplete) await announceRecruitmentComplete({ server, gameId });
  });

  redirect(serverPath({ slug: server.slug, path: `/games/${gameId}` }));
}
