import type { CalendarEvent } from "./calendar-event";
import { escapeIcsText } from "./escape-ics-text";
import { foldIcsLine } from "./fold-ics-line";
import { utcStamp } from "./utc-stamp";

// 시각은 UTC로 써서 VTIMEZONE 없이 Asia/Seoul과 같은 순간을 가리킨다.
export function buildIcs({
  event,
  gameId,
  now = new Date(),
}: {
  event: CalendarEvent;
  gameId: string;
  now?: Date;
}) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Roll and Call//KO",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${gameId}@roll-and-call`,
    `DTSTAMP:${utcStamp(now)}`,
    `DTSTART:${utcStamp(event.startsAt)}`,
    `DTEND:${utcStamp(event.endsAt)}`,
    `SUMMARY:${escapeIcsText(event.summary)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    `URL:${event.url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `${lines.map(foldIcsLine).join("\r\n")}\r\n`;
}
