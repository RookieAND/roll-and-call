import type { CalendarEvent } from "./calendar-event";
import { utcStamp } from "./utc-stamp";

// 설명 끝에 구인 주소가 있어 장소(location)는 두지 않는다.
export function googleCalendarUrl(event: CalendarEvent) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.summary,
    dates: `${utcStamp(event.startsAt)}/${utcStamp(event.endsAt)}`,
    details: event.description,
    ctz: "Asia/Seoul",
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}
