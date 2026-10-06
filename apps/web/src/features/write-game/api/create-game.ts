"use server";

import { createGameWithRoster } from "@roll-and-call/database/games";
import { listSanctionedUserIds } from "@roll-and-call/database/moderation";
import { countServerMembers } from "@roll-and-call/database/profiles";
import { uniq } from "es-toolkit";
import { redirect } from "next/navigation";
import { after } from "next/server";

import { RULE_GATE, ruleGate, ruleSetOf, toMyRulebooks } from "@/entities/rulebook";
import { type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import {
  announceGameOpened,
  findActiveSanction,
  getActingMember,
  getRulebookRecords,
  notMemberError,
} from "@/shared/server";

import { gameFormSchema, type GameFormValues } from "../model/game-form";
import { invalidInputResult } from "../model/invalid-input-result";
import { pastScheduleError } from "../model/past-schedule-error";
import { toGameColumns } from "../model/to-game-columns";

export async function createGame(input: GameFormValues): Promise<ActionResult> {
  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;

  if (await findActiveSanction({ serverId: server.id, userId: user.id })) {
    return { error: "활동 정지 기간에는 새 구인을 열 수 없습니다." };
  }

  const parsed = gameFormSchema.safeParse(input);
  if (!parsed.success) {
    return invalidInputResult(parsed.error.issues[0]);
  }
  const columns = toGameColumns(parsed.data);
  const pastError = pastScheduleError({
    endDate: columns.endDate,
    confirmedAt: columns.confirmedAt,
  });
  if (pastError) return pastError;

  // 룰은 카테고리·판본 단위다. 표시 이름은 "카테고리 판본", 구인은 그 판본의 첫 기본 룰북을 가리킨다.
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
    const sanctioned = await listSanctionedUserIds({ serverId: server.id, userIds: invitedIds });
    if (sanctioned.length > 0) {
      return { error: "활동이 정지된 사람은 직접 확정할 수 없습니다.", field: "preConfirmed" };
    }
  }

  const gameId = await createGameWithRoster({
    serverId: server.id,
    columns: {
      gmId: user.id,
      rule: set.label,
      rulebookId: set.cores[0]!.id,
      ...columns,
    },
    confirmedUserIds: invitedIds,
  });

  after(() =>
    announceGameOpened({
      server,
      gameId,
      confirmedUserIds: invitedIds,
      maxPlayers: Number(parsed.data.maxPlayers),
    }),
  );

  redirect(serverPath({ slug: server.slug, path: `/games/${gameId}` }));
}
