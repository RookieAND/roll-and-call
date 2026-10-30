import type { Game, Server } from "@roll-and-call/database";
import { RECRUIT_METHOD } from "@roll-and-call/database/games/model";
import { sendDiscordMessage, DISCORD_COLOR } from "@roll-and-call/discord";
import {
  gameHeadValues,
  gameNoticeEmbed,
  messageHeadInput,
  messageText,
} from "@roll-and-call/game-notices";
import { headcountFields, memberName, memberNoticeLine } from "@roll-and-call/game-notices";

type JoinInfo = {
  applicantId: string;
  gmName: string;
  confirmedCount: number;
  waitingCount: number;
  isWaiting: boolean;
};

export async function notifyGameJoined({
  server,
  game,
  applicantId,
  gmName,
  confirmedCount,
  waitingCount,
  isWaiting,
}: JoinInfo & { server: Server; game: Game }) {
  if (!game.discordThreadId) return;

  const applicant = await memberName({ serverId: server.id, userId: applicantId });
  // 추첨·선발 모집의 신청은 대기가 아니라 결과를 기다리는 신청이라 문구를 따로 쓴다.
  const applyTextKey = applyTextKeyOf({ recruitMethod: game.recruitMethod, isWaiting });
  const values = gameHeadValues({ server, game, gmName });
  const line = await memberNoticeLine({
    serverId: server.id,
    userIds: [applicantId],
    key: `${applyTextKey}_line`,
    values,
  });
  const embed = gameNoticeEmbed({
    slug: server.slug,
    game,
    gmName,
    emoji: isWaiting ? "⏳" : "🙋",
    color: isWaiting ? DISCORD_COLOR.waiting : DISCORD_COLOR.confirmed,
    description: line.after
      ? undefined
      : await messageText({
          serverId: server.id,
          key: applyTextKey,
          values: { ...values, 참여자: applicant },
        }),
    fields: headcountFields({ game, confirmedCount, waitingCount }),
  });

  await sendDiscordMessage({
    channelId: game.discordThreadId,
    input: {
      embeds: [embed],
      ...(await messageHeadInput({
        serverId: server.id,
        key: "apply",
        values,
        // 추첨·선발은 신청자가 모두 대기 상태라 그 수를 신청 인원으로 알린다.
        headSuffix:
          game.recruitMethod === RECRUIT_METHOD.firstCome
            ? `(${confirmedCount}/${game.maxPlayers})`
            : `(${waitingCount}명 신청)`,
        ...line,
      })),
    },
  });
}

function applyTextKeyOf({
  recruitMethod,
  isWaiting,
}: {
  recruitMethod: Game["recruitMethod"];
  isWaiting: boolean;
}) {
  if (recruitMethod !== RECRUIT_METHOD.firstCome) return "apply_pending";
  return isWaiting ? "apply_waiting" : "apply";
}
