import { cn, Text } from "@trpg/ui";

import { toKst } from "@/shared/lib";

import type { CalendarSession } from "../model/to-calendar-sessions";

export function HomeSessionCard({ session }: { session: CalendarSession }) {
  const time = toKst(session.startsAt).format("HH:mm");
  const meta = [
    session.rule,
    `GM ${session.gm.username}`,
    `${session.players.length}/${session.maxPlayers}`,
  ].join(" · ");
  const cardTone = session.mine
    ? "border-tinted-border bg-tinted-bg hover:bg-tinted-bg-hover"
    : "border-gray-200 hover:bg-gray-50";

  return (
    <div className={cn("rounded-[13px] border px-[13px] py-3 transition-colors", cardTone)}>
      <div className="flex items-center gap-2">
        <Text typography="subtitle1" className="min-w-0 flex-1 truncate text-[14.5px]">
          {session.title}
        </Text>
        {session.mine && (
          <span className="flex-none rounded-md bg-primary-50 px-[7px] py-[3px] text-[10.5px] leading-none font-bold text-tinted-ink">
            내가 참여
          </span>
        )}
      </div>
      <Text
        typography="body4"
        render={<div />}
        className="mt-[5px] text-[12.5px] font-bold tabular-nums"
      >
        {time}
      </Text>
      <Text
        typography="body4"
        foreground="muted"
        render={<div />}
        className="mt-[3px] text-[12.5px]"
      >
        {meta}
      </Text>
    </div>
  );
}
