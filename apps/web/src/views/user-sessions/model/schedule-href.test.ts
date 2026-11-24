import { describe, expect, it, vi } from "vitest";

import { SESSION_ROLE } from "@/entities/game";

import { scheduleHref } from "./schedule-href";
import { SCHEDULE_TAB } from "./schedule-tab";

vi.mock("server-only", () => ({}));

describe("scheduleHref", () => {
  it("예정 탭은 쿼리 없이, 지난 탭·날짜·달은 쿼리로 적는다", () => {
    const base = { userId: "u", role: SESSION_ROLE.host };
    expect(scheduleHref(base)).toBe("/users/u/sessions/host");
    expect(
      scheduleHref({ ...base, tab: SCHEDULE_TAB.past, date: "2026-11-20", month: "2026-11" }),
    ).toBe("/users/u/sessions/host?tab=past&date=2026-11-20&month=2026-11");
  });
});
