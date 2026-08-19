import type { ReactNode } from "react";
import { Avatar } from "@trpg/ui";
import { SCHEDULE_MODE } from "@/entities/game";
import type { GameDetailData } from "@/entities/game/api/queries";
import { formatDate, formatDateTime } from "@/shared/lib/format";

// 순수 표시: 게임 상세 정보 표. 링크·동작 없음.
export function GameInfoTable({
  game,
  count,
}: {
  game: GameDetailData;
  count: number;
}) {
  const rows: { k: string; v: ReactNode }[] = [
    { k: "룰", v: game.rule },
    {
      k: "GM",
      v: (
        <span className="inline-flex items-center gap-2">
          <Avatar src={game.gm?.avatarUrl} name={game.gm?.username} size="sm" />
          {game.gm?.username ?? "?"}
        </span>
      ),
    },
    { k: "인원", v: `${count}/${game.maxPlayers}명` },
    ...(game.playTime ? [{ k: "플레이타임", v: game.playTime }] : []),
    { k: "모집 마감", v: formatDateTime(game.endDate) },
    ...(game.scheduleMode === SCHEDULE_MODE.coordinate &&
    game.rangeStart &&
    game.rangeEnd
      ? [
          {
            k: "세션 예정일",
            v: `${formatDate(game.rangeStart)} — ${formatDate(game.rangeEnd)}`,
          },
        ]
      : []),
  ];

  return (
    <div className="overflow-hidden rounded-[14px] border border-gray-200">
      {rows.map((row) => (
        <div
          key={row.k}
          className="flex gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0"
        >
          <span className="w-[82px] shrink-0 text-[12.5px] text-gray-500">
            {row.k}
          </span>
          <div className="flex-1 text-[13.5px] font-semibold text-gray-800">
            {row.v}
          </div>
        </div>
      ))}
    </div>
  );
}
