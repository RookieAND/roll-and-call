import type { CalendarEvent } from "./calendar-event";
import { googleCalendarUrl } from "./google-calendar-url";

const GOOGLE_CALENDAR_PACKAGE = "com.google.android.calendar";
const APP_EVENT_EDIT_PATH = "/calendar/r/eventedit";

// 안드로이드 크롬이 구글 캘린더 앱을 바로 연다. 앱이 없으면 웹 주소로 넘어간다.
// 앱은 웹 전용 /calendar/render 를 받지 않아 일정 편집 경로로 보낸다.
export function googleCalendarIntentUrl(event: CalendarEvent) {
  const webUrl = googleCalendarUrl(event);
  const { host, search } = new URL(webUrl);
  const fallback = encodeURIComponent(webUrl);
  return `intent://${host}${APP_EVENT_EDIT_PATH}${search}#Intent;scheme=https;package=${GOOGLE_CALENDAR_PACKAGE};S.browser_fallback_url=${fallback};end`;
}
