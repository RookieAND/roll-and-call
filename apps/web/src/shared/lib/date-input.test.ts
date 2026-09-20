import { describe, expect, it } from "vitest";

import { addDays } from "./add-days";
import { buildDayColumns } from "./build-day-columns";
import { ddayKst } from "./dday-kst";
import { formatDate } from "./format-date";
import { formatDateTime } from "./format-date-time";
import { fromKstDateTimeInput } from "./from-kst-date-time-input";
import { slotIso } from "./slot-iso";
import { toKstDateInput } from "./to-kst-date-input";
import { toKstDateTimeInput } from "./to-kst-date-time-input";

// TZ=UTC(Vercel)에서도 같은 결과여야 하므로 실행 환경 타임존에 기대지 않는다.
describe("KST 입력과 저장값", () => {
  const saved = fromKstDateTimeInput("2026-09-16T20:00");

  it("입력은 KST로 읽어 UTC로 저장한다", () => {
    expect(saved.toISOString()).toBe("2026-09-16T11:00:00.000Z");
  });

  it("저장값을 되읽으면 같은 입력으로 돌아온다", () => {
    expect(toKstDateTimeInput(saved)).toBe("2026-09-16T20:00");
    expect(formatDateTime(saved)).toBe("9월 16일 (수) 20:00");
  });

  it("날짜가 넘어가는 시각도 KST 기준으로 가른다", () => {
    expect(toKstDateTimeInput("2026-09-16T15:30:00Z")).toBe("2026-09-17T00:30");
    expect(toKstDateInput("2026-09-16T15:30:00Z")).toBe("2026-09-17");
    expect(formatDate("2026-09-16T15:30:00Z")).toBe("9월 17일");
    expect(ddayKst("2026-09-16T15:30:00Z", new Date("2026-09-16T14:30:00Z"))).toBe(1);
  });

  it("칸 시각도 KST로 읽는다", () => {
    expect(slotIso("2026-09-16", 23, 30)).toBe("2026-09-16T14:30:00.000Z");
  });
});

describe("addDays", () => {
  it("달과 해를 넘어간다", () => {
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
  });
});

describe("buildDayColumns", () => {
  it("해를 넘겨도 이어 붙인다", () => {
    expect(buildDayColumns("2026-12-31", "2027-01-01").map((column) => column.label)).toEqual([
      "12/31(목)",
      "1/1(금)",
    ]);
  });

  it("아무리 길어도 61칸에서 끊는다", () => {
    expect(buildDayColumns("2026-01-01", "2026-12-31")).toHaveLength(61);
  });
});
