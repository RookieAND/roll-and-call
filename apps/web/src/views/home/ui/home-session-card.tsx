import { cn, Text } from "@trpg/ui";
import { User } from "lucide-react";

import { toKst } from "@/shared/lib";

import type { CalendarSession } from "../model/to-calendar-sessions";

export function HomeSessionCard({ session }: { session: CalendarSession }) {
  const time = toKst(session.startsAt).format("HH:mm");
  const full = session.players.length >= session.maxPlayers;
  const cardTone = session.mine
    ? "border-tinted-border bg-tinted-bg hover:bg-tinted-bg-hover"
    : "border-gray-200 hover:bg-gray-50";

  return (
    <div
      className={cn(
        "flex gap-[11px] rounded-[13px] border px-[13px] py-3 transition-colors",
        cardTone,
      )}
    >
      <span className="w-11 flex-none pt-px text-[13px] font-extrabold tabular-nums">{time}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-[7px]">
          <Text typography="subtitle1" className="min-w-0 flex-1 truncate text-[14.5px]">
            {session.title}
          </Text>
          {session.mine && (
            <span className="flex-none rounded-md bg-primary-50 px-[7px] py-[3px] text-[10.5px] leading-none font-bold text-tinted-ink">
              내가 참여
            </span>
          )}
        </div>
        <div className="mt-[7px] flex items-center gap-[7px]">
          <span className="flex h-5 flex-none items-center rounded-md bg-gray-100 px-[7px] text-[11px] font-bold text-gray-700">
            {session.rule}
          </span>
          <Text
            typography="body4"
            foreground="muted"
            render={<span />}
            className="min-w-0 flex-1 truncate text-[11.5px]"
          >
            GM {session.gm.username}
          </Text>
          <span
            aria-label={`참여 인원 ${session.players.length}/${session.maxPlayers}`}
            className={cn(
              "flex flex-none items-center gap-1",
              full ? "text-hint" : "text-tinted-ink",
            )}
          >
            <User size={12} aria-hidden />
            <span className="text-[11.5px] font-bold tabular-nums">
              {session.players.length}/{session.maxPlayers}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
