import type { Game } from "@/shared/api/db";
import { formatDate, formatDateTime, formatMonthDay } from "@/shared/lib/format";
import { sendDiscordAnnouncement, type DiscordEmbed } from "./webhook";

const COLOR = {
  recruit: 0x5865f2, // blurple — 새 구인
  confirmed: 0x57f287, // green — 참여 확정
  waiting: 0xfee75c, // yellow — 대기열
  complete: 0xeb459e, // pink — 구인 완료
} as const;

// 링크는 배포 도메인이 있을 때만. 없으면 embed url 생략.
function gameUrl(id: string): string | undefined {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);
  return base ? `${base.replace(/\/$/, "")}/games/${id}` : undefined;
}

function scheduleText(game: Game): string {
  if (game.confirmedAt) return formatDateTime(game.confirmedAt);
  if (game.scheduleMode === "coordinate" && game.rangeStart && game.rangeEnd) {
    return `${formatDate(game.rangeStart)} ~ ${formatDate(game.rangeEnd)} 중 조율`;
  }
  return "조율 후 확정";
}

// 개요는 긴 텍스트 — Discord description 상한(4096)에 맞춰 잘라 넣는다.
function overview(synopsis: string | null): string | undefined {
  if (!synopsis) return undefined;
  const body = synopsis.length > 4000 ? `${synopsis.slice(0, 4000)}…` : synopsis;
  return `**개요**\n${body}`;
}

export async function notifyGameCreated(game: Game, gmName: string) {
  const url = gameUrl(game.id);
  const fields = [
    { name: "📜 사용 룰", value: game.rule, inline: true },
    { name: "👥 인원", value: `${game.maxPlayers}명`, inline: true },
    { name: "🕒 시간", value: scheduleText(game), inline: false },
  ];
  // webhook은 진짜 버튼을 못 붙이므로 마스크드 링크를 CTA로 쓴다. base URL 있을 때만.
  if (url) fields.push({ name: "\u200b", value: `**[▶ 참여하러 가기](${url})**`, inline: false });

  const embed: DiscordEmbed = {
    title: `🎲 ${game.title}`,
    url,
    description: overview(game.synopsis),
    color: COLOR.recruit,
    fields,
    image: game.thumbnailUrl ? { url: game.thumbnailUrl } : undefined,
    footer: { text: `GM ${gmName} · 마감 ${formatMonthDay(game.endDate)}` },
    timestamp: new Date().toISOString(),
  };

  await sendDiscordAnnouncement({ content: "📢 새로운 구인 글이 올라왔어요!", embeds: [embed] });
}

type JoinInfo = {
  applicantName: string;
  gmName: string;
  confirmedCount: number;
  isWaiting: boolean;
};

export async function notifyGameJoined(
  game: Game,
  { applicantName, gmName, confirmedCount, isWaiting }: JoinInfo,
) {
  const embed: DiscordEmbed = {
    title: `🙋 ${game.title}`,
    url: gameUrl(game.id),
    description: `**${applicantName}**님이 참여를 신청했어요.`,
    color: isWaiting ? COLOR.waiting : COLOR.confirmed,
    fields: [
      { name: "상태", value: isWaiting ? "⏳ 대기열" : "✅ 확정", inline: true },
      { name: "현재 인원", value: `${confirmedCount}/${game.maxPlayers}`, inline: true },
      { name: "📜 사용 룰", value: game.rule, inline: true },
    ],
    footer: { text: `GM ${gmName}` },
    timestamp: new Date().toISOString(),
  };

  await sendDiscordAnnouncement({ content: "🙋 새로운 참여 신청이 있어요!", embeds: [embed] });
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
      { name: "🕒 시간", value: scheduleText(game), inline: false },
    ],
    footer: { text: `GM ${gmName}` },
    timestamp: new Date().toISOString(),
  };

  // 멘션은 content에 있어야 실제 알림이 울린다 (embed 내부 멘션은 핑 안 감).
  await sendDiscordAnnouncement({ content: mentions, embeds: [embed], userMentions: mentionIds });
}

// 세션 시작 1시간 전 리마인더. 멘션은 content에 있어야 핑이 간다.
export async function notifySessionStartingSoon(game: Game, gmName: string, mentionIds: string[]) {
  const mentions = mentionIds.map((did) => `<@${did}>`).join(" ");
  const content =
    `⏰ 곧 시작! **${game.title}** 세션이 ${formatDateTime(game.confirmedAt!)}에 시작해요.\n` +
    `룰: ${game.rule} · GM: ${gmName}\n${mentions}`;
  await sendDiscordAnnouncement({ content, userMentions: mentionIds });
}
