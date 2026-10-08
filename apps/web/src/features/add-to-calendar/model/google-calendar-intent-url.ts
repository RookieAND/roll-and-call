import type { CalendarEvent } from "./calendar-event";
import { googleCalendarUrl } from "./google-calendar-url";

const GOOGLE_CALENDAR_PACKAGE = "com.google.android.calendar";

// 안드로이드 크롬이 구글 캘린더 앱을 바로 연다. 앱이 없으면 웹 주소로 넘어간다.
export function googleCalendarIntentUrl(event: CalendarEvent) {
  const webUrl = googleCalendarUrl(event);
  const { host, pathname, search } = new URL(webUrl);
  const fallback = encodeURIComponent(webUrl);
  return `intent://${host}${pathname}${search}#Intent;scheme=https;package=${GOOGLE_CALENDAR_PACKAGE};S.browser_fallback_url=${fallback};end`;
}
