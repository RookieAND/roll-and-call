"use server";

import { getRulebookRecords } from "@roll-and-call/database/certifications";
import { createGameWithRoster } from "@roll-and-call/database/games";
import { listSanctionedUserIds, findActiveSanction } from "@roll-and-call/database/moderation";
import { createNotifications } from "@roll-and-call/database/notifications";
import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";
import { countServerMembers } from "@roll-and-call/database/profiles";
import { syncGameSupplementRequests } from "@roll-and-call/database/rulebooks";
import { withTransaction } from "@roll-and-call/database/transaction";
import { uniq } from "es-toolkit";
import { redirect } from "next/navigation";
import { after } from "next/server";

import { GAME_VISIBILITY } from "@/entities/game";
import { RULE_GATE, isCertEnforced, ruleGate, ruleSetOf, toMyRulebooks } from "@/entities/rulebook";
import { type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import {
  announceGameOpened,
  getActingMember,
  notMemberError,
  resolveNoticeLinkLabels,
} from "@/shared/server";

import { checkSupplements } from "../model/check-supplements";
import { gameFormSchema, type GameFormValues } from "../model/game-form";
import { invalidInputResult } from "../model/invalid-input-result";
import { manualSupplementNames } from "../model/manual-supplement-names";
import { pastScheduleError } from "../model/past-schedule-error";
import { toGameColumns } from "../model/to-game-columns";
import { toPrivateColumns } from "../model/to-private-columns";

export async function createGame(input: GameFormValues): Promise<ActionResult> {
  const parsed = gameFormSchema.safeParse(input);
  if (!parsed.success) {
    return invalidInputResult(parsed.error.issues[0]);
  }

  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;

  if (await findActiveSanction({ serverId: server.id, userId: user.id })) {
    return { error: "활동 정지 기간에는 새 구인을 열 수 없습니다." };
  }
  const isPrivate = parsed.data.visibility === GAME_VISIBILITY.private;
  const columns = isPrivate
    ? toPrivateColumns(toGameColumns(parsed.data))
    : toGameColumns(parsed.data);
  const pastError = pastScheduleError({
    endDate: isPrivate ? undefined : columns.endDate,
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
  const supplementCheck = checkSupplements({
    supplements: parsed.data.supplements,
    set,
    enforced: isCertEnforced(myRulebooks.enforcementDate),
  });
  if (!supplementCheck.ok) return { error: supplementCheck.error, field: "supplements" };

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

  const linkLabels = await resolveNoticeLinkLabels({
    guildId: server.discordGuildId,
    notice: columns.notice,
  });

  const supplements = supplementCheck.supplements;
  const gameId = await withTransaction(async (transaction) => {
    const createdId = await createGameWithRoster({
      transaction,
      serverId: server.id,
      columns: {
        gmId: user.id,
        visibility: isPrivate ? GAME_VISIBILITY.private : GAME_VISIBILITY.public,
        rule: set.label,
        rulebookId: set.cores[0]!.id,
        ...columns,
        // 성인 전용 표기를 켜지 않은 서버에서는 고를 수 없다.
        adultOnly: columns.adultOnly && server.adultOnlyEnabled,
        // 인증 없이 열 수 있는 룰에는 인증 조건을 걸 수 없다.
        requireRulebookCert: columns.requireRulebookCert && !set.free,
        supplements,
        linkLabels,
      },
      confirmedUserIds: invitedIds,
    });
    // 비공개 구인은 디스코드 확정 안내가 없으므로 지정한 사람에게 참여자 추가 때와 같은 받은 알림을 보낸다.
    if (isPrivate) {
      await createNotifications({
        executor: transaction,
        serverId: server.id,
        actorId: user.id,
        notifications: invitedIds.map((userId) => ({
          userId,
          kind: NOTIFICATION_KIND.participationConfirmed,
          params: { gameId: createdId, gameTitle: columns.title },
        })),
      });
    }
    await syncGameSupplementRequests({
      transaction,
      serverId: server.id,
      gameId: createdId,
      gmId: user.id,
      categoryId: set.categoryId,
      edition: set.edition,
      names: manualSupplementNames(supplements),
    });
    return createdId;
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
