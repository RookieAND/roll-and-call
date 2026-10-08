import { describe, expect, it } from "vitest";

import type { CalendarEvent } from "./calendar-event";
import { googleCalendarIntentUrl } from "./google-calendar-intent-url";
import { googleCalendarUrl } from "./google-calendar-url";

const event: CalendarEvent = {
  summary: "크툴루의 부름",
  description: "https://example.com/games/1",
  url: "https://example.com/games/1",
  startsAt: new Date("2026-10-10T11:00:00Z"),
  endsAt: new Date("2026-10-10T14:00:00Z"),
};

describe("googleCalendarIntentUrl", () => {
  it("웹 주소와 같은 경로·쿼리를 인텐트로 감싸고 웹 주소를 대체 주소로 둔다", () => {
    const intent = googleCalendarIntentUrl(event);
    const web = new URL(googleCalendarUrl(event));
    expect(
      intent.startsWith(`intent://calendar.google.com/calendar/r/eventedit${web.search}#Intent;`),
    ).toBe(true);
    expect(intent).toContain("package=com.google.android.calendar");
    expect(intent).toContain(`S.browser_fallback_url=${encodeURIComponent(web.toString())};end`);
  });
});
