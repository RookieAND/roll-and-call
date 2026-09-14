import type { ReactNode } from "react";
import { Text } from "@trpg/ui";
import { GameGmLabel } from "@/entities/game";
import type { GameDetailData } from "@/shared/server";
import { formatDateTime, formatGameSchedule } from "@/shared/lib";
// 순수 표시: 게임 상세 정보 표. 링크·동작 없음.
// 값이 composite(GM 아바타)거나 조건부 포맷(세션 일정)인 행은 entity에 위임하고,
// 나머지는 문자열로 둔다. 인원은 참여자 섹션 한 곳(진행바 포함)에서만 보여준다.
export function GameInfoTable({ game, isGm }: { game: GameDetailData; isGm: boolean }) {
  const rows: { k: string; v: ReactNode }[] = [
    { k: "룰", v: game.rule },
    {
      k: "GM",
      v: (
        <span className="inline-flex items-center gap-1.5">
          <GameGmLabel
            name={game.gm?.username}
            avatarUrl={game.gm?.avatarUrl}
            showRole={false}
            typography="subtitle2"
            foreground="normal"
          />
          {isGm && (
            <Text typography="body4" foreground="hint" render={<span />}>
              나
            </Text>
          )}
        </span>
      ),
    },
    ...(game.playTime ? [{ k: "플레이타임", v: game.playTime }] : []),
    { k: "모집 마감일", v: formatDateTime(game.endDate) },
    { k: "세션 일정", v: formatGameSchedule(game) },
  ];

  return (
    <div className="overflow-hidden rounded-[14px] border border-gray-200">
      {rows.map((row) => (
        <div
          key={row.k}
          className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0"
        >
          <Text typography="body3" foreground="muted" className="w-[82px] shrink-0">
            {row.k}
          </Text>
          <Text typography="subtitle2" render={<div />} className="flex-1 items-center">
            {row.v}
          </Text>
        </div>
      ))}
    </div>
  );
}
