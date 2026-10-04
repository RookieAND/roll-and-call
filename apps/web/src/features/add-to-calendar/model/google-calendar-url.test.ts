import { describe, expect, it } from "vitest";

import { calendarEvent } from "./calendar-event";
import { googleCalendarUrl } from "./google-calendar-url";

describe("googleCalendarUrl", () => {
  it("제목·시각·설명·시간대를 인코딩해 넣는다", () => {
    const event = calendarEvent({
      title: "물벼락 & 친구들",
      rule: "CoC",
      gmNickname: "새벽별",
      startsAt: new Date("2026-09-16T20:00:00+09:00"),
      playMinutes: null,
      gameUrl: "https://example.com/trpia/games/1",
    });
    const url = new URL(googleCalendarUrl(event));
    expect(url.origin + url.pathname).toBe("https://calendar.google.com/calendar/render");
    expect(url.searchParams.get("action")).toBe("TEMPLATE");
    expect(url.searchParams.get("text")).toBe("물벼락 & 친구들 · 롤앤콜");
    expect(url.searchParams.get("dates")).toBe("20260916T110000Z/20260916T140000Z");
    expect(url.searchParams.get("details")).toBe(
      "룰: CoC\nGM: 새벽별\nhttps://example.com/trpia/games/1",
    );
    expect(url.searchParams.get("ctz")).toBe("Asia/Seoul");
    expect(url.search).toContain("%26");
  });
});
