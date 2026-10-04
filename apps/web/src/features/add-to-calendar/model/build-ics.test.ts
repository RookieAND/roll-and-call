import { describe, expect, it } from "vitest";

import { buildIcs } from "./build-ics";
import { calendarEvent } from "./calendar-event";

const START = new Date("2026-09-16T20:00:00+09:00");
const NOW = new Date("2026-09-14T03:04:05Z");
const GAME_ID = "11111111-2222-3333-4444-555555555555";
const event = (overrides: Partial<Parameters<typeof calendarEvent>[0]> = {}) =>
  calendarEvent({
    title: "물벼락",
    rule: "크툴루의 부름 7판",
    gmNickname: "새벽별",
    startsAt: START,
    playMinutes: 240,
    gameUrl: `https://example.com/trpia/games/${GAME_ID}`,
    ...overrides,
  });
const unfold = (ics: string) => ics.replace(/\r\n /g, "");

describe("buildIcs", () => {
  it("필수 줄을 CRLF로 잇고 시각은 UTC로 쓴다", () => {
    const ics = buildIcs({ event: event(), gameId: GAME_ID, now: NOW });
    expect(ics.endsWith("\r\n")).toBe(true);
    expect(ics.split("\r\n").slice(0, 6)).toEqual([
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Roll and Call//KO",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
    ]);
    const lines = unfold(ics).split("\r\n");
    expect(lines).toContain(`UID:${GAME_ID}@roll-and-call`);
    expect(lines).toContain("DTSTAMP:20260914T030405Z");
    expect(lines).toContain("DTSTART:20260916T110000Z");
    expect(lines).toContain("DTEND:20260916T150000Z");
    expect(lines).toContain("SUMMARY:물벼락 · 롤앤콜");
    expect(lines).toContain(`URL:https://example.com/trpia/games/${GAME_ID}`);
    expect(lines.at(-2)).toBe("END:VCALENDAR");
  });

  it("플레이타임이 없으면 3시간으로 본다", () => {
    const ics = unfold(
      buildIcs({ event: event({ playMinutes: null }), gameId: GAME_ID, now: NOW }),
    );
    expect(ics).toContain("DTEND:20260916T140000Z");
  });

  it("쉼표·세미콜론·역슬래시·줄바꿈을 이스케이프한다", () => {
    const ics = unfold(
      buildIcs({ event: event({ title: "a,b;c\\d" }), gameId: GAME_ID, now: NOW }),
    );
    expect(ics).toContain("SUMMARY:a\\,b\\;c\\\\d · 롤앤콜");
    expect(ics).toContain("DESCRIPTION:룰: 크툴루의 부름 7판\\nGM: 새벽별\\nhttps://");
  });

  it("75옥텟을 넘는 줄은 접고 한글 글자를 가운데서 자르지 않는다", () => {
    const title = "가나다라마바사아자차카타파하".repeat(4);
    const ics = buildIcs({ event: event({ title }), gameId: GAME_ID, now: NOW });
    const encoder = new TextEncoder();
    for (const line of ics.split("\r\n")) {
      expect(encoder.encode(line).length).toBeLessThanOrEqual(75);
      expect(line).not.toContain("�");
    }
    expect(unfold(ics)).toContain(`SUMMARY:${title} · 롤앤콜`);
  });
});
