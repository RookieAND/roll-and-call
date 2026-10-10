import { RANKING_MODE, type RankingMode } from "@roll-and-call/database/servers/model";

type Winner = { userId: string; nickname: string; sessionCount: number; score?: number };

const escapeMarkdown = (text: string) => text.replace(/[[\]*_\\]/g, "\\$&");

// 월간 발표 본문(R6). 멘션 없이 닉네임에 프로필 링크를 건다. 공동 1위는 쉼표로 잇고 횟수(점수)는 1위 기준 하나다.
// 포인트제는 세션 횟수 대신 점수를 적는다.
export function monthlyAnnouncementText({
  month,
  gm,
  pl,
  profileUrl,
  mode = RANKING_MODE.count,
}: {
  month: string;
  gm: Winner[];
  pl: Winner[];
  profileUrl: (userId: string) => string;
  mode?: RankingMode;
}): string {
  const names = (winners: Winner[]) =>
    winners
      .map((winner) => `[${escapeMarkdown(winner.nickname)}](${profileUrl(winner.userId)})`)
      .join(", ");
  const record = (winner: Winner, verb: string) =>
    mode === RANKING_MODE.points
      ? `${winner.score ?? 0}점`
      : `세션 ${winner.sessionCount}회 ${verb}`;
  const lines = [`**${Number(month.split("-")[1])}월 이달의 GM·PL**`];
  if (gm.length > 0) lines.push(`🎖️ 이달의 GM: ${names(gm)} · ${record(gm[0]!, "진행")}`);
  if (pl.length > 0) lines.push(`🏅 이달의 PL: ${names(pl)} · ${record(pl[0]!, "참여")}`);
  return lines.join("\n");
}
