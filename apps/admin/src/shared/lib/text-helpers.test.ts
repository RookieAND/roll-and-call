import { describe, expect, it } from "vitest";

import { formatRelativeTime } from "./format-relative-time";
import { withSubjectParticle } from "./with-subject-particle";

describe("withSubjectParticle", () => {
  it("받침 유무로 이·가를 고른다", () => {
    expect(withSubjectParticle("김코코")).toBe("김코코가");
    expect(withSubjectParticle("탐정놀이중")).toBe("탐정놀이중이");
    expect(withSubjectParticle("이름없는GM")).toBe("이름없는GM이(가)");
  });
});

describe("formatRelativeTime", () => {
  const now = new Date("2026-09-22T12:00:00+09:00");
  it("가장 큰 단위로 말한다", () => {
    expect(formatRelativeTime(new Date("2026-09-22T11:59:30+09:00"), now)).toBe("방금");
    expect(formatRelativeTime(new Date("2026-09-22T11:50:00+09:00"), now)).toBe("10분 전");
    expect(formatRelativeTime(new Date("2026-09-21T10:00:00+09:00"), now)).toBe("어제");
  });
});

describe("formatDateTime", () => {
  it("한국 시간으로 연·월·일·시각을 쓴다", async () => {
    const { formatDateTime } = await import("./format-date-time");
    expect(formatDateTime(new Date("2026-09-22T05:36:00Z"))).toBe("2026년 9월 22일 14:36");
  });
});

describe("formatDayRange", () => {
  it("같은 달이면 뒤쪽 달을 줄인다", async () => {
    const { formatDayRange } = await import("./format-day-range");
    expect(formatDayRange(new Date("2026-09-16T03:00:00Z"), new Date("2026-09-22T03:00:00Z"))).toBe(
      "2026년 9월 16일~22일",
    );
    expect(formatDayRange(new Date("2026-08-30T03:00:00Z"), new Date("2026-09-05T03:00:00Z"))).toBe(
      "2026년 8월 30일~9월 5일",
    );
  });
});

describe("formatSessionTime", () => {
  it("요일을 괄호로 붙인다", async () => {
    const { formatSessionTime } = await import("./format-session-time");
    expect(formatSessionTime(new Date("2026-09-20T11:00:00Z"))).toBe("2026년 9월 20일 (일) 20:00");
  });
});

describe("withTopicParticle", () => {
  it("받침 유무로 은·는을 고른다", async () => {
    const { withTopicParticle } = await import("./with-topic-particle");
    expect(withTopicParticle("김코코")).toBe("김코코는");
    expect(withTopicParticle("탐정놀이중")).toBe("탐정놀이중은");
  });
});
