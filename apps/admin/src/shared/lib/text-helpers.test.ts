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

describe("withTopicParticle", () => {
  it("받침 유무로 은·는을 고른다", async () => {
    const { withTopicParticle } = await import("./with-topic-particle");
    expect(withTopicParticle("김코코")).toBe("김코코는");
    expect(withTopicParticle("탐정놀이중")).toBe("탐정놀이중은");
  });
});
