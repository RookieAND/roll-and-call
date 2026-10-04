import { effectivePlayMinutes } from "@/entities/game";

export interface CalendarEvent {
  summary: string;
  description: string;
  startsAt: Date;
  endsAt: Date;
  url: string;
}

const MINUTE_MS = 60_000;

export function calendarEvent({
  title,
  rule,
  gmNickname,
  startsAt,
  playMinutes,
  gameUrl,
}: {
  title: string;
  rule: string;
  gmNickname: string;
  startsAt: Date;
  playMinutes: number | null;
  gameUrl: string;
}): CalendarEvent {
  return {
    summary: `${title} · 롤앤콜`,
    description: [`룰: ${rule}`, `GM: ${gmNickname}`, gameUrl].join("\n"),
    startsAt,
    endsAt: new Date(startsAt.getTime() + effectivePlayMinutes(playMinutes) * MINUTE_MS),
    url: gameUrl,
  };
}
