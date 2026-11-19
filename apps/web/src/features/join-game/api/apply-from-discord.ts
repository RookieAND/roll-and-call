import "server-only";
import { getGameWithRoster } from "@roll-and-call/database/games";
import { multiRoundNoticeLine } from "@roll-and-call/database/games/model";
import { getUserIdByDiscordId } from "@roll-and-call/database/profiles";
import { getActiveMembership, getServerByGuildId } from "@roll-and-call/database/servers";

import { RECRUIT_METHOD } from "@/entities/game";
import { serverPath } from "@/shared/lib";
import { siteOrigin } from "@/shared/server";

import { discordNoteMessage } from "../model/discord-note-message";
import { joinSuccessMessage } from "../model/join-success-message";
import { NOTE_LENGTH_MESSAGE } from "../model/note-length-message";
import { NOTE_REQUIRED_REASON } from "../model/note-required-rejection";
import { applyToGame } from "./apply-to-game";
import { finishApplication } from "./finish-application";

const COMMITMENT_REQUIRED_MESSAGE = "마지막 회차까지 함께해야 신청할 수 있습니다.";

export type DiscordApplyResult =
  | { message: string }
  | { askNote: true; question: string }
  | { askCommitment: true; scheduleLine: string; note?: { question: string | null } };

// 디스코드 버튼으로 온 신청. discordId는 서명을 확인한 인터랙션에서 온 값이라 그대로 믿는다.
export async function applyFromDiscord({
  guildId,
  discordId,
  gameId,
  applicationNote,
  commitment,
}: {
  guildId: string;
  discordId: string;
  gameId: string;
  applicationNote?: string;
  // 다회차 모달의 「마지막 회차까지 함께하겠습니다」. 버튼을 막 눌렀으면 undefined다.
  commitment?: boolean;
}): Promise<DiscordApplyResult> {
  const server = await getServerByGuildId(guildId);
  if (!server) return { message: "이 서버에서는 신청할 수 없습니다." };

  const userId = await getUserIdByDiscordId(discordId);
  const membership = userId && (await getActiveMembership({ serverId: server.id, userId }));
  if (!userId || !membership) {
    const url = `${siteOrigin() ?? ""}${serverPath({ slug: server.slug, path: `/games/${gameId}` })}`;
    return { message: `아직 가입하지 않았습니다. 가입한 뒤 신청해 주세요. ${url}` };
  }

  // 다회차는 신청 전에 일정과 약속을 모달로 받는다. 신청글을 받는 구인이면 같은 모달에 신청글 칸을 둔다.
  if (commitment !== true) {
    const game = await getGameWithRoster({ serverId: server.id, gameId });
    const scheduleLine = game && multiRoundNoticeLine(game);
    if (scheduleLine) {
      if (commitment === false) return { message: COMMITMENT_REQUIRED_MESSAGE };
      return {
        askCommitment: true,
        scheduleLine,
        note: game.applicationNoteEnabled ? { question: game.applicationQuestion } : undefined,
      };
    }
  }

  const application = await applyToGame({
    serverId: server.id,
    gameId,
    userId,
    applicationNote,
  });
  if ("error" in application) {
    // 막힘 검사를 모두 통과했지만 신청글이 필요하면 글쓰기 모달을 열도록 알린다.
    if ("reason" in application && application.reason === NOTE_REQUIRED_REASON) {
      return { askNote: true, question: application.question };
    }
    if (application.error === NOTE_LENGTH_MESSAGE) {
      return { message: discordNoteMessage(applicationNote) };
    }
    return { message: application.error };
  }

  await finishApplication({ server, userId, application });
  return {
    message: joinSuccessMessage({
      waiting: application.waiting,
      application: application.game.recruitMethod !== RECRUIT_METHOD.firstCome,
    }),
  };
}
