import type { Server } from "@roll-and-call/database";
import {
  claimEndNotice,
  getGameForNotice,
  listConfirmedDiscordIds,
  releaseEndNotice,
} from "@roll-and-call/database/games";
import { countConfirmed, REVIEW_WRITE_DAYS } from "@roll-and-call/database/games/model";
import { getDiscordId } from "@roll-and-call/database/profiles";
import { DISCORD_COLOR, sendDiscordMessage } from "@roll-and-call/discord";
import { compact, uniq } from "es-toolkit";

import { gameUrl } from "../lib/game-url";
import { gameHeadValues, messageHeadInput } from "../lib/message-head-input";
import { messageText } from "../lib/message-text";
import { gameNoticeEmbed } from "./game-notice-embed";
import { isRetryableNoticeError } from "./is-retryable-notice-error";
import { REVIEW_BUTTON_PREFIX } from "./review-button";

// 끝난 세션의 스레드에 종료와 후기 작성을 알린다. 안내 권리를 먼저 가져가므로 마치기 직후 호출과 크론이 겹쳐도 한 번만 나간다.
// 확정 참여자가 없으면 후기를 받을 사람이 없어 올리지 않는다.
// 잠깐의 실패(디스코드 5xx·429, DB 오류)면 권리를 돌려줘 크론이 다시 보낸다.
export async function notifyGameEnded({ server, gameId }: { server: Server; gameId: string }) {
  const claimedAt = new Date();
  if (!(await claimEndNotice({ serverId: server.id, gameId, now: claimedAt }))) return;
  try {
    const game = await getGameForNotice({ serverId: server.id, gameId });
    if (!game?.discordThreadId || countConfirmed(game.participants) === 0) return;

    const gmName = game.gm?.username ?? "?";
    const values = gameHeadValues({ server, game, gmName });
    const [gmDiscordId, playerDiscordIds] = await Promise.all([
      getDiscordId(game.gmId),
      listConfirmedDiscordIds({ serverId: server.id, gameId }),
    ]);
    const discordIds = uniq(compact([gmDiscordId, ...playerDiscordIds]));
    const detailUrl = gameUrl({ slug: server.slug, gameId: game.id });

    await sendDiscordMessage({
      channelId: game.discordThreadId,
      input: {
        ...(await messageHeadInput({
          serverId: server.id,
          key: "end",
          values,
          alsoMention: discordIds.map((id) => ({ id })),
        })),
        embeds: [
          gameNoticeEmbed({
            slug: server.slug,
            game,
            gmName,
            emoji: "🏁",
            color: DISCORD_COLOR.complete,
            description: await messageText({ serverId: server.id, key: "end", values }),
            fields: [
              { name: "📜 룰", value: game.rule, inline: true },
              {
                name: "✍ 후기 작성 기간",
                value: reviewPeriodText(game.attendanceFirstConfirmedAt),
                inline: true,
              },
            ],
          }),
        ],
        buttons: [
          { label: "✍ 바로 작성하기", customId: `${REVIEW_BUTTON_PREFIX}${game.id}` },
          ...(detailUrl ? [{ label: "🌐 웹에서 작성하기", url: `${detailUrl}/review` }] : []),
        ],
      },
    });
  } catch (error) {
    if (isRetryableNoticeError(error)) {
      await releaseEndNotice({ serverId: server.id, gameId, claimedAt });
    }
    throw error;
  }
}

// 출석을 확정하면 그 시각부터 센다. 종료 안내 때는 보통 아직 확정 전이라 기간만 적는다. 확정돼 있으면 디스코드가 보는 사람의 시간대로 마감 시각을 보여 준다.
function reviewPeriodText(attendanceFirstConfirmedAt: Date | null) {
  if (!attendanceFirstConfirmedAt) return `출석 확인 후 ${REVIEW_WRITE_DAYS}일 이내`;
  const deadline = new Date(attendanceFirstConfirmedAt.getTime() + REVIEW_WRITE_DAYS * 86_400_000);
  return `<t:${Math.floor(deadline.getTime() / 1000)}:f>까지`;
}
