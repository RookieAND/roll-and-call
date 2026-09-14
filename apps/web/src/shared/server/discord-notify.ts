import type { Game } from "@/shared/server";
import { formatDateTime, formatGameSchedule, formatMonthDay } from "@/shared/lib";
import { db } from "./db";
import {
  editDiscordMessage,
  renameDiscordThread,
  sendDiscordMessage,
  startDiscordThread,
  type DiscordEmbed,
} from "./discord-bot";

const COLOR = {
  recruit: 0x5865f2, // blurple — 새 구인
  confirmed: 0x57f287, // green — 참여 확정
  waiting: 0xfee75c, // yellow — 대기열
  left: 0x99aab5, // gray — 이탈
  complete: 0xeb459e, // pink — 구인 완료
} as const;

const recruitChannelId = () => process.env.DISCORD_RECRUIT_CHANNEL_ID; // 모집 공지·리마인더
const closedChannelId = () => process.env.DISCORD_CLOSED_CHANNEL_ID; // 모집 마감

// 링크는 배포 도메인이 있을 때만. 없으면 embed url 생략.
function gameUrl(id: string): string | undefined {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);
  return base ? `${base.replace(/\/$/, "")}/games/${id}` : undefined;
}

// 개요는 긴 텍스트 — Discord description 상한(4096)에 맞춰 잘라 넣는다.
function overview(synopsis: string | null): string | undefined {
  if (!synopsis) return undefined;
  const body = synopsis.length > 4000 ? `${synopsis.slice(0, 4000)}…` : synopsis;
  return `**개요**\n${body}`;
}

const countConfirmed = (participants: { status: string }[]) =>
  participants.filter((p) => p.status === "confirmed").length;

// 모집 공지 embed. 개설 때 보내고, 로스터가 바뀌면 같은 모양으로 고친다.
function recruitEmbed(game: Game, gmName: string, confirmedCount: number): DiscordEmbed {
  const url = gameUrl(game.id);
  const fields = [
    { name: "📜 사용 룰", value: game.rule, inline: true },
    { name: "👥 인원", value: `${confirmedCount}/${game.maxPlayers}명`, inline: true },
    { name: "🕒 시간", value: formatGameSchedule(game), inline: false },
  ];
  // 메시지 버튼(component)은 인터랙션 엔드포인트가 필요해서 마스크드 링크를 CTA로 쓴다. base URL 있을 때만.
  if (url) fields.push({ name: "​", value: `**[▶ 참여하러 가기](${url})**`, inline: false });

  return {
    title: `🎲 ${game.title}`,
    url,
    description: overview(game.synopsis),
    color: COLOR.recruit,
    fields,
    image: game.thumbnailUrl ? { url: game.thumbnailUrl } : undefined,
    footer: { text: `GM ${gmName} · 마감 ${formatMonthDay(game.endDate)}` },
    timestamp: game.createdAt.toISOString(),
  };
}

// 공지를 보내고 그 메시지에 스레드를 연다. 반환값은 스레드 id (= 공지 메시지 id, 실패 시 undefined).
export async function notifyGameCreated(game: Game, gmName: string): Promise<string | undefined> {
  const message = await sendDiscordMessage(recruitChannelId(), {
    content: "📢 새로운 구인 글이 올라왔어요!",
    embeds: [recruitEmbed(game, gmName, 0)],
  });
  return message && startDiscordThread(message, game.title);
}

// 모집 공지의 인원·내용을 현재 DB 기준으로 고친다. 로스터나 구인 내용이 바뀐 뒤에 부른다.
export async function refreshRecruitPost(gameId: string) {
  const game = await db.query.games.findFirst({
    where: (g, { eq }) => eq(g.id, gameId),
    with: {
      gm: { columns: { username: true } },
      participants: { columns: { status: true } },
    },
  });
  if (!game?.discordThreadId) return;

  await Promise.all([
    editDiscordMessage(recruitChannelId(), game.discordThreadId, {
      embeds: [recruitEmbed(game, game.gm?.username ?? "?", countConfirmed(game.participants))],
    }),
    renameDiscordThread(game.discordThreadId, game.title),
  ]);
}

type JoinInfo = {
  applicantName: string;
  gmName: string;
  confirmedCount: number;
  isWaiting: boolean;
};

// 참여 확정·대기 등록은 모집 공지 스레드에만 올린다. 스레드가 없는 게임은 건너뛴다.
export async function notifyGameJoined(
  game: Game,
  { applicantName, gmName, confirmedCount, isWaiting }: JoinInfo,
) {
  if (!game.discordThreadId) return;

  const embed: DiscordEmbed = {
    title: `${isWaiting ? "⏳" : "🙋"} ${game.title}`,
    url: gameUrl(game.id),
    description: isWaiting
      ? `**${applicantName}**님이 대기열에 등록했어요.`
      : `**${applicantName}**님이 참여했어요.`,
    color: isWaiting ? COLOR.waiting : COLOR.confirmed,
    fields: [
      { name: "상태", value: isWaiting ? "⏳ 대기열" : "✅ 확정", inline: true },
      { name: "현재 인원", value: `${confirmedCount}/${game.maxPlayers}`, inline: true },
    ],
    footer: { text: `GM ${gmName}` },
    timestamp: new Date().toISOString(),
  };

  await sendDiscordMessage(game.discordThreadId, { embeds: [embed] });
}

// 참여 취소 또는 GM 내보내기. 삭제 후에 불러야 현재 인원이 맞다. 스레드에만 올린다.
export async function notifyGameLeft(gameId: string, userId: string, removedByGm: boolean) {
  const [game, user] = await Promise.all([
    db.query.games.findFirst({
      where: (g, { eq }) => eq(g.id, gameId),
      with: {
        gm: { columns: { username: true } },
        participants: { columns: { status: true } },
      },
    }),
    db.query.profiles.findFirst({
      where: (p, { eq }) => eq(p.id, userId),
      columns: { username: true },
    }),
  ]);
  if (!game?.discordThreadId) return;

  const name = user?.username ?? "?";
  const embed: DiscordEmbed = {
    title: `🚪 ${game.title}`,
    url: gameUrl(game.id),
    description: removedByGm
      ? `**${name}**님이 참여 목록에서 제외됐어요.`
      : `**${name}**님이 참여를 취소했어요.`,
    color: COLOR.left,
    fields: [
      {
        name: "현재 인원",
        value: `${countConfirmed(game.participants)}/${game.maxPlayers}`,
        inline: true,
      },
    ],
    footer: { text: `GM ${game.gm?.username ?? "?"}` },
    timestamp: new Date().toISOString(),
  };

  await sendDiscordMessage(game.discordThreadId, { embeds: [embed] });
}

export async function notifyRecruitmentComplete(game: Game, gmName: string, mentionIds: string[]) {
  const mentions = mentionIds.map((id) => `<@${id}>`).join(" ");
  const embed: DiscordEmbed = {
    title: `🎉 ${game.title} — 구인 완료!`,
    url: gameUrl(game.id),
    color: COLOR.complete,
    fields: [
      { name: "📜 사용 룰", value: game.rule, inline: true },
      { name: "👥 인원", value: `${game.maxPlayers}/${game.maxPlayers}`, inline: true },
      { name: "🕒 시간", value: formatGameSchedule(game), inline: false },
    ],
    footer: { text: `GM ${gmName}` },
    timestamp: new Date().toISOString(),
  };

  // 멘션은 content에 있어야 실제 알림이 울린다 (embed 내부 멘션은 핑 안 감).
  await sendDiscordMessage(closedChannelId(), {
    content: mentions,
    embeds: [embed],
    userMentions: mentionIds,
  });
}

// 세션 시작 1시간 전 리마인더. 멘션은 content에 있어야 핑이 간다.
export async function notifySessionStartingSoon(game: Game, gmName: string, mentionIds: string[]) {
  const mentions = mentionIds.map((did) => `<@${did}>`).join(" ");
  const content =
    `⏰ 곧 시작! **${game.title}** 세션이 ${formatDateTime(game.confirmedAt!)}에 시작해요.\n` +
    `룰: ${game.rule} · GM: ${gmName}\n${mentions}`;
  await sendDiscordMessage(recruitChannelId(), { content, userMentions: mentionIds });
}
