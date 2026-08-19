import Link from "next/link";
import { Chip } from "@trpg/ui";
import { GAME_STATUS } from "@/entities/game";
import type { GamesFilter } from "@/entities/game/api/queries";

type StatusKey = GamesFilter["status"];

const STATUS_CHIPS = [
  { key: undefined, label: "전체" },
  { key: GAME_STATUS.recruiting, label: "일정조율" },
  { key: GAME_STATUS.confirmed, label: "확정" },
  { key: GAME_STATUS.closed, label: "마감" },
] as const;

export function GameStatusFilter({
  status,
  hrefFor,
}: {
  status?: StatusKey;
  hrefFor: (status: StatusKey) => string;
}) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4">
      {STATUS_CHIPS.map((c) => {
        const active = status === c.key;
        return (
          <Chip key={c.label} asChild selected={active}>
            <Link href={hrefFor(c.key)}>{c.label}</Link>
          </Chip>
        );
      })}
    </div>
  );
}
