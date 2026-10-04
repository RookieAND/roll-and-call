type Winner = { userId: string; nickname: string; sessionCount: number };

const escapeMarkdown = (text: string) => text.replace(/[[\]*_\\]/g, "\\$&");

// 월간 발표 본문(R6). 멘션 없이 닉네임에 프로필 링크를 건다. 공동 1위는 쉼표로 잇고 횟수는 1위 기준 하나다.
export function monthlyAnnouncementText({
  month,
  gm,
  pl,
  profileUrl,
}: {
  month: string;
  gm: Winner[];
  pl: Winner[];
  profileUrl: (userId: string) => string;
}): string {
  const names = (winners: Winner[]) =>
    winners
      .map((winner) => `[${escapeMarkdown(winner.nickname)}](${profileUrl(winner.userId)})`)
      .join(", ");
  const lines = [`**${Number(month.split("-")[1])}월 이달의 GM·PL**`];
  if (gm.length > 0) lines.push(`🎖️ 이달의 GM: ${names(gm)} · 세션 ${gm[0]!.sessionCount}회 진행`);
  if (pl.length > 0) lines.push(`🏅 이달의 PL: ${names(pl)} · 세션 ${pl[0]!.sessionCount}회 참여`);
  return lines.join("\n");
}
